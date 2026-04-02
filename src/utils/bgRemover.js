import {
  AutoModelForImageSegmentation,
  AutoProcessor,
  RawImage,
  env,
} from '@huggingface/transformers';
import { removeBackground, preload as imglyPreload } from '@imgly/background-removal';

/**
 * Background removal engine with two tiers:
 *
 * PRIMARY — RMBG-1.4 (BRIA AI) via HuggingFace Transformers.js
 *   - State-of-the-art segmentation network designed for BG removal
 *   - Handles hair, fur, semi-transparent objects, complex edges
 *   - Quality comparable to Figma / Photoshop / remove.bg
 *   - Runs in-browser via ONNX + WebGPU (or WASM fallback)
 *
 * FALLBACK — ISNet via @imgly/background-removal
 *   - Used only if RMBG-1.4 fails to load
 *
 * Both outputs go through alpha refinement post-processing.
 */

// ── Config ──
const RMBG_MODEL = 'briaai/RMBG-1.4';
env.allowLocalModels = false;

let rmbgModel = null;
let rmbgProcessor = null;
let rmbgFailed = false;

// ── Preload on app start ──
export async function preloadModel() {
  try {
    await loadRMBG();
  } catch {
    // Silently fall back — will use ISNet when processImage is called
    rmbgFailed = true;
    imglyPreload({ model: 'isnet', device: 'gpu', debug: false }).catch(() => {});
  }
}

// ── Load RMBG-1.4 ──
async function loadRMBG(onProgress) {
  if (rmbgModel && rmbgProcessor) return;

  const progressCallback = onProgress
    ? (info) => {
        if (typeof info.progress === 'number') {
          onProgress(Math.min(75, Math.round(info.progress * 0.75)));
        }
      }
    : undefined;

  // Try WebGPU first, then WASM
  let device = 'webgpu';
  try {
    if (!navigator.gpu) device = 'wasm';
  } catch {
    device = 'wasm';
  }

  try {
    rmbgModel = await AutoModelForImageSegmentation.from_pretrained(RMBG_MODEL, {
      device,
      dtype: 'fp32',
      progress_callback: progressCallback,
    });
  } catch {
    // WebGPU failed, try WASM
    if (device === 'webgpu') {
      rmbgModel = await AutoModelForImageSegmentation.from_pretrained(RMBG_MODEL, {
        device: 'wasm',
        dtype: 'fp32',
        progress_callback: progressCallback,
      });
    } else {
      throw new Error('Failed to load RMBG model');
    }
  }

  rmbgProcessor = await AutoProcessor.from_pretrained(RMBG_MODEL, {
    progress_callback: progressCallback,
  });
}

// ══════════════════════════════════════════
// PUBLIC API
// ══════════════════════════════════════════

export async function processImage(imageSrc, onProgress) {
  // Try RMBG first (best quality)
  if (!rmbgFailed) {
    try {
      return await processWithRMBG(imageSrc, onProgress);
    } catch (err) {
      console.warn('RMBG failed, falling back to ISNet:', err);
      rmbgFailed = true;
    }
  }

  // Fallback: ISNet via @imgly
  return await processWithISNet(imageSrc, onProgress);
}

// ══════════════════════════════════════════
// RMBG-1.4 pipeline
// ══════════════════════════════════════════

async function processWithRMBG(imageSrc, onProgress) {
  // Step 1: Load model (0-75%)
  await loadRMBG(onProgress);
  if (onProgress) onProgress(78);

  // Step 2: Load image
  const image = await RawImage.fromURL(imageSrc);
  if (onProgress) onProgress(80);

  // Step 3: Preprocess
  const { pixel_values } = await rmbgProcessor(image);
  if (onProgress) onProgress(83);

  // Step 4: Inference
  const result = await rmbgModel({ input: pixel_values });
  if (onProgress) onProgress(90);

  // Step 5: Extract mask from model output
  // RMBG outputs multi-scale predictions; take the finest one
  const outputKey = Object.keys(result).pop();
  const rawMask = result[outputKey];

  const maskTensor = rawMask
    .squeeze()        // Remove batch dim
    .sigmoid()        // Convert logits to probabilities [0,1]
    .mul(255)
    .clamp(0, 255)
    .to('uint8');

  const mask = await RawImage.fromTensor(maskTensor);
  const resizedMask = await mask.resize(image.width, image.height);
  if (onProgress) onProgress(93);

  // Step 6: Composite — apply mask to original image on canvas
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');

  // Draw original
  const origImg = await loadImage(imageSrc);
  ctx.drawImage(origImg, 0, 0, canvas.width, canvas.height);

  // Apply alpha from mask
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const px = imageData.data;
  const maskData = resizedMask.data;

  for (let i = 0; i < maskData.length; i++) {
    px[i * 4 + 3] = maskData[i]; // Set alpha
    if (maskData[i] === 0) {
      px[i * 4] = 0;
      px[i * 4 + 1] = 0;
      px[i * 4 + 2] = 0;
    }
  }

  // Step 7: Refine edges (Photoshop-style)
  refineAlpha(px, canvas.width, canvas.height);

  ctx.putImageData(imageData, 0, 0);
  if (onProgress) onProgress(98);

  // Step 8: Export
  const blob = await canvasToBlob(canvas);
  if (onProgress) onProgress(100);
  return URL.createObjectURL(blob);
}

// ══════════════════════════════════════════
// ISNet fallback pipeline
// ══════════════════════════════════════════

async function processWithISNet(imageSrc, onProgress) {
  const progressMap = {};
  const blob = await removeBackground(imageSrc, {
    model: 'isnet',
    device: 'gpu',
    rescale: true,
    output: { format: 'image/png', quality: 1 },
    progress: (key, current, total) => {
      if (total > 0) {
        progressMap[key] = { current, total };
        const keys = Object.keys(progressMap);
        const done = keys.reduce((s, k) => s + progressMap[k].current, 0);
        const full = keys.reduce((s, k) => s + progressMap[k].total, 0);
        if (onProgress && full > 0) {
          onProgress(Math.min(89, Math.round((done / full) * 100)));
        }
      }
    },
    debug: false,
  });

  if (onProgress) onProgress(90);

  // Post-process ISNet output too
  const refined = await refineBlob(blob);
  if (onProgress) onProgress(100);
  return URL.createObjectURL(refined);
}

// ══════════════════════════════════════════
// Alpha refinement (runs on both engines)
// ══════════════════════════════════════════

/**
 * Edge-adaptive alpha refinement — similar to Photoshop's "Refine Edge":
 * 1. Threshold: kill near-transparent halos, solidify near-opaque
 * 2. Edge-only Gaussian smoothing: natural soft transition at boundaries
 * 3. Color decontamination: zero RGB where alpha = 0
 */
function refineAlpha(px, w, h) {
  const len = w * h;
  const alpha = new Float32Array(len);
  for (let i = 0; i < len; i++) alpha[i] = px[i * 4 + 3] / 255;

  // Threshold
  for (let i = 0; i < len; i++) {
    if (alpha[i] < 0.06) alpha[i] = 0;
    else if (alpha[i] > 0.94) alpha[i] = 1;
  }

  // Edge-adaptive 3x3 Gaussian blur (only on transition pixels)
  const out = new Float32Array(alpha);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = y * w + x;
      if (alpha[idx] > 0.03 && alpha[idx] < 0.97) {
        let sum = 0, wt = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const d = Math.sqrt(dx * dx + dy * dy);
            const weight = Math.exp(-d * d * 0.72);
            sum += alpha[(y + dy) * w + (x + dx)] * weight;
            wt += weight;
          }
        }
        out[idx] = sum / wt;
      }
    }
  }

  // Write back
  for (let i = 0; i < len; i++) {
    const a = Math.round(out[i] * 255);
    px[i * 4 + 3] = a;
    if (a === 0) {
      px[i * 4] = 0;
      px[i * 4 + 1] = 0;
      px[i * 4 + 2] = 0;
    }
  }
}

/** Refine an already-composited PNG blob (ISNet fallback path). */
async function refineBlob(blob) {
  const img = await loadImage(URL.createObjectURL(blob));
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  refineAlpha(imageData.data, canvas.width, canvas.height);
  ctx.putImageData(imageData, 0, 0);

  return canvasToBlob(canvas);
}

// ── Helpers ──

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function canvasToBlob(canvas) {
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
}

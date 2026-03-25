import React from 'react';
import { Upload, Cpu, Sparkles, Download, Shield, Zap, Globe, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './HowItWorks.module.css';

const steps = [
  {
    icon: Upload,
    title: 'Upload your image',
    desc: 'Drag and drop or click to select any JPG, PNG, or WebP image from your device. Files stay on your machine — nothing is uploaded to a server.'
  },
  {
    icon: Cpu,
    title: 'AI processes locally',
    desc: 'A neural network model (U-Net architecture) loads directly in your browser via WebAssembly and ONNX Runtime. It analyzes every pixel to separate foreground from background.'
  },
  {
    icon: Sparkles,
    title: 'Background is removed',
    desc: 'The model generates a precision alpha matte, cleanly isolating the subject. Complex edges like hair, fur, and transparent objects are handled with sub-pixel accuracy.'
  },
  {
    icon: Download,
    title: 'Download or edit',
    desc: 'Preview the result side by side, then download as a transparent PNG. You can also edit — adjust brightness, contrast, rotate, flip, and zoom before saving.'
  }
];

const techDetails = [
  {
    icon: Shield,
    title: '100% Private',
    desc: 'Your images never leave your device. All processing happens client-side using WebAssembly. No data is sent to any server, no cookies, no tracking.'
  },
  {
    icon: Zap,
    title: 'WebAssembly Powered',
    desc: 'We use ONNX Runtime compiled to WebAssembly (Wasm) for near-native performance in the browser. On supported devices, WebGPU acceleration kicks in automatically.'
  },
  {
    icon: Globe,
    title: 'Works Offline',
    desc: 'After the initial model download (~25 MB cached), the tool works without an internet connection. The model is cached in your browser for instant reuse.'
  }
];

const HowItWorks = ({ onBack }) => {
  return (
    <motion.div
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <button className={styles.backBtn} onClick={onBack}>
        <ArrowLeft size={14} />
        Back to app
      </button>

      <div className={styles.header}>
        <h1 className={styles.title}>How it works</h1>
        <p className={styles.subtitle}>
          ClearCut uses a deep learning model running entirely in your browser to remove image backgrounds. Here's the step-by-step process.
        </p>
      </div>

      <div className={styles.stepsGrid}>
        {steps.map((step, i) => (
          <motion.div
            key={i}
            className={styles.stepCard}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <div className={styles.stepNumber}>{i + 1}</div>
            <div className={styles.stepIcon}>
              <step.icon size={18} />
            </div>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.stepDesc}>{step.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className={styles.sectionDivider} />

      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>Under the hood</h2>
        <p className={styles.subtitle}>
          The technology behind ClearCut — no servers, no subscriptions, just modern web APIs.
        </p>
      </div>

      <div className={styles.techGrid}>
        {techDetails.map((item, i) => (
          <motion.div
            key={i}
            className={styles.techCard}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.08 }}
          >
            <div className={styles.techIcon}>
              <item.icon size={16} />
            </div>
            <div>
              <h3 className={styles.techTitle}>{item.title}</h3>
              <p className={styles.techDesc}>{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className={styles.sectionDivider} />

      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>The AI pipeline</h2>
        <p className={styles.subtitle}>
          A simplified view of what happens inside the neural network when you press "Remove Background".
        </p>
      </div>

      <div className={styles.pipeline}>
        <div className={styles.pipelineStep}>
          <span className={styles.pipelineLabel}>Input</span>
          <span className={styles.pipelineDesc}>RGB image (any resolution)</span>
        </div>
        <div className={styles.pipelineArrow}>&darr;</div>
        <div className={styles.pipelineStep}>
          <span className={styles.pipelineLabel}>Preprocessing</span>
          <span className={styles.pipelineDesc}>Resize to 320×320, normalize pixel values to [0, 1]</span>
        </div>
        <div className={styles.pipelineArrow}>&darr;</div>
        <div className={styles.pipelineStep}>
          <span className={styles.pipelineLabel}>Encoder</span>
          <span className={styles.pipelineDesc}>Convolutional layers extract features — edges, textures, shapes</span>
        </div>
        <div className={styles.pipelineArrow}>&darr;</div>
        <div className={styles.pipelineStep}>
          <span className={styles.pipelineLabel}>Decoder</span>
          <span className={styles.pipelineDesc}>Upsampling layers reconstruct a pixel-level segmentation mask</span>
        </div>
        <div className={styles.pipelineArrow}>&darr;</div>
        <div className={styles.pipelineStep}>
          <span className={styles.pipelineLabel}>Alpha Matte</span>
          <span className={styles.pipelineDesc}>Per-pixel opacity map separating foreground from background</span>
        </div>
        <div className={styles.pipelineArrow}>&darr;</div>
        <div className={styles.pipelineStep}>
          <span className={styles.pipelineLabel}>Output</span>
          <span className={styles.pipelineDesc}>Transparent PNG at original resolution</span>
        </div>
      </div>
    </motion.div>
  );
};

export default HowItWorks;

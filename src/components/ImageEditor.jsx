import React, { useState, useRef, useCallback, useEffect } from 'react';
import { RotateCw, FlipHorizontal, FlipVertical, Sun, Contrast, ZoomIn, ZoomOut, Undo, Download, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './ImageEditor.module.css';

const ImageEditor = ({ imageSrc, onBack, onDone }) => {
  const canvasRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [zoom, setZoom] = useState(100);
  const [imgEl, setImgEl] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setImgEl(img);
    img.src = imageSrc;
  }, [imageSrc]);

  const renderCanvas = useCallback(() => {
    if (!imgEl || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const isRotated = rotation % 180 !== 0;
    const w = isRotated ? imgEl.height : imgEl.width;
    const h = isRotated ? imgEl.width : imgEl.height;

    const scale = zoom / 100;
    canvas.width = w * scale;
    canvas.height = h * scale;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(imgEl, -imgEl.width * scale / 2, -imgEl.height * scale / 2, imgEl.width * scale, imgEl.height * scale);

    ctx.restore();
  }, [imgEl, rotation, flipH, flipV, brightness, contrast, zoom]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  const handleReset = () => {
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setBrightness(100);
    setContrast(100);
    setZoom(100);
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'clearcut-edited.png';
    link.href = canvasRef.current.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      className={styles.editor}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className={styles.toolbar}>
        <button className={styles.backBtn} onClick={onBack}>
          <ArrowLeft size={14} />
          <span>Back</span>
        </button>
        <span className={styles.toolbarTitle}>Edit Image</span>
        <button className={styles.resetBtn} onClick={handleReset}>
          <Undo size={12} />
          <span>Reset</span>
        </button>
      </div>

      <div className={styles.canvasArea}>
        <div className={styles.checkerboard}>
          <canvas ref={canvasRef} className={styles.canvas} />
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.controlGroup}>
          <span className={styles.groupLabel}>Transform</span>
          <div className={styles.buttonRow}>
            <button className={styles.controlBtn} onClick={() => setRotation((r) => (r + 90) % 360)} title="Rotate 90°">
              <RotateCw size={14} />
            </button>
            <button className={`${styles.controlBtn} ${flipH ? styles.active : ''}`} onClick={() => setFlipH((f) => !f)} title="Flip horizontal">
              <FlipHorizontal size={14} />
            </button>
            <button className={`${styles.controlBtn} ${flipV ? styles.active : ''}`} onClick={() => setFlipV((f) => !f)} title="Flip vertical">
              <FlipVertical size={14} />
            </button>
          </div>
        </div>

        <div className={styles.controlGroup}>
          <span className={styles.groupLabel}>Zoom</span>
          <div className={styles.sliderRow}>
            <button className={styles.controlBtn} onClick={() => setZoom((z) => Math.max(25, z - 25))} title="Zoom out">
              <ZoomOut size={14} />
            </button>
            <input
              type="range"
              min="25"
              max="200"
              step="5"
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className={styles.slider}
            />
            <button className={styles.controlBtn} onClick={() => setZoom((z) => Math.min(200, z + 25))} title="Zoom in">
              <ZoomIn size={14} />
            </button>
            <span className={styles.sliderValue}>{zoom}%</span>
          </div>
        </div>

        <div className={styles.controlGroup}>
          <span className={styles.groupLabel}>
            <Sun size={11} /> Brightness
          </span>
          <div className={styles.sliderRow}>
            <input
              type="range"
              min="0"
              max="200"
              step="5"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className={styles.slider}
            />
            <span className={styles.sliderValue}>{brightness}%</span>
          </div>
        </div>

        <div className={styles.controlGroup}>
          <span className={styles.groupLabel}>
            <Contrast size={11} /> Contrast
          </span>
          <div className={styles.sliderRow}>
            <input
              type="range"
              min="0"
              max="200"
              step="5"
              value={contrast}
              onChange={(e) => setContrast(Number(e.target.value))}
              className={styles.slider}
            />
            <span className={styles.sliderValue}>{contrast}%</span>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button className="btn btn-secondary" onClick={onDone}>
          Done
        </button>
        <button className="btn btn-primary" onClick={handleDownload}>
          <Download size={14} />
          Download Edited
        </button>
      </div>
    </motion.div>
  );
};

export default ImageEditor;

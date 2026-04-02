import React, { useState } from 'react';
import { Download, RefreshCw, ThumbsUp, ThumbsDown, Pencil, Check, Palette, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Preview.module.css';
import confetti from 'canvas-confetti';

const BG_COLORS = [
  null,        // transparent (checkerboard)
  '#FFFFFF',
  '#000000',
  '#635bff',
  '#EF4444',
  '#22C55E',
  '#3B82F6',
  '#F59E0B',
  '#EC4899',
  '#8B5CF6',
];

const Preview = ({ original, processed, onReset, onEdit, onAddNew }) => {
  const [feedback, setFeedback] = useState(null);
  const [bgColor, setBgColor] = useState(null);
  const [showBgPicker, setShowBgPicker] = useState(false);

  const handleDownload = () => {
    if (!processed) return;

    if (bgColor) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const link = document.createElement('a');
        link.download = 'clearcut-bg-removed.png';
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
      img.src = processed;
      return;
    }

    const link = document.createElement('a');
    link.href = processed;
    link.download = 'clearcut-bg-removed.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLike = () => {
    if (feedback === 'liked') return;
    setFeedback('liked');
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#635bff', '#818CF8', '#ffffff'],
    });
  };

  const processedBgStyle = bgColor
    ? { backgroundColor: bgColor }
    : undefined;

  return (
    <div className={styles.container}>
      {/* ── Side-by-side comparison ── */}
      <motion.div
        className={styles.grid}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.badge}>Original</span>
          </div>
          <div className={styles.imageWrapper}>
            <img src={original} alt="Original" className={styles.image} />
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={`${styles.badge} ${styles.badgeSuccess}`}>
              <Check size={10} style={{ marginRight: 3 }} />
              Background Removed
            </span>
          </div>
          <div
            className={`${styles.imageWrapper} ${!bgColor ? styles.transparentBg : ''}`}
            style={processedBgStyle}
          >
            <img src={processed} alt="Background removed" className={styles.image} />
          </div>
        </div>
      </motion.div>

      {/* ── Primary actions ── */}
      <motion.div
        className={styles.primaryActions}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {onAddNew && (
          <button className="btn btn-secondary" onClick={onAddNew} title="Process another image">
            <Plus size={14} />
            Add
          </button>
        )}
        <button className="btn btn-secondary" onClick={onReset}>
          <RefreshCw size={14} />
          Reset
        </button>
        <button className="btn btn-secondary" onClick={onEdit}>
          <Pencil size={14} />
          Edit
        </button>
        <button
          className={`btn btn-secondary ${showBgPicker ? styles.btnActive : ''}`}
          onClick={() => setShowBgPicker((v) => !v)}
        >
          <Palette size={14} />
          Background
        </button>
        <button className="btn btn-primary" onClick={handleDownload}>
          <Download size={14} />
          Download PNG
        </button>
      </motion.div>

      {/* ── Background color picker ── */}
      <AnimatePresence>
        {showBgPicker && (
          <motion.div
            className={styles.bgPicker}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <span className={styles.bgPickerLabel}>Background color</span>
            <div className={styles.bgSwatches}>
              {BG_COLORS.map((color, i) => (
                <button
                  key={i}
                  className={`${styles.swatch} ${bgColor === color ? styles.swatchActive : ''}`}
                  style={color ? { backgroundColor: color } : undefined}
                  onClick={() => setBgColor(color)}
                  title={color || 'Transparent'}
                  aria-label={color || 'Transparent'}
                >
                  {!color && <span className={styles.swatchCheckerboard} />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Optional feedback ── */}
      <AnimatePresence mode="wait">
        {feedback === null && (
          <motion.div
            key="feedback"
            className={styles.feedbackRow}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <span className={styles.feedbackQuestion}>How's the result?</span>
            <button className={`${styles.feedbackBtn} ${styles.dislikeBtn}`} onClick={() => setFeedback('disliked')}>
              <ThumbsDown size={13} /> Not great
            </button>
            <button className={`${styles.feedbackBtn} ${styles.likeBtn}`} onClick={handleLike}>
              <ThumbsUp size={13} /> Love it!
            </button>
          </motion.div>
        )}

        {feedback === 'liked' && (
          <motion.p key="liked" className={styles.feedbackThanks} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            Glad you liked it!
          </motion.p>
        )}

        {feedback === 'disliked' && (
          <motion.p key="disliked" className={styles.feedbackThanks} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span style={{ color: '#F87171' }}>Thanks for the feedback — the AI is still improving.</span>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Preview;

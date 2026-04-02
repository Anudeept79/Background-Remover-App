import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRandomFact } from '../utils/techFacts';
import ScissorAnimation from './ScissorAnimation';
import styles from './LoadingWithFacts.module.css';

const STATUS_LINES = [
  [0, 'Initializing AI engine…'],
  [12, 'Loading neural network…'],
  [35, 'Analyzing your image…'],
  [55, 'Detecting subject…'],
  [72, 'Separating background…'],
  [88, 'Refining edges…'],
  [96, 'Almost done…'],
];

function getStatusLine(pct) {
  for (let i = STATUS_LINES.length - 1; i >= 0; i--) {
    if (pct >= STATUS_LINES[i][0]) return STATUS_LINES[i][1];
  }
  return STATUS_LINES[0][1];
}

/**
 * Time-based simulated progress.
 *
 * Real ML progress is unpredictable (jumps from 0→90% when cached).
 * Instead, we simulate a smooth curve: 0→85% over ~8s (ease-out).
 * When the real progress hits 100 (done), we animate to 100%.
 * The displayed value is always max(simulated, real) so it never goes backwards.
 */
const LoadingWithFacts = ({ progress = 0 }) => {
  const [displayPct, setDisplayPct] = useState(0);
  const startTime = useRef(Date.now());
  const rafRef = useRef(null);
  const doneRef = useRef(false);

  // Mark done when real progress reaches 100
  useEffect(() => {
    if (progress >= 100) doneRef.current = true;
  }, [progress]);

  useEffect(() => {
    const DURATION = 8000; // 8 seconds to reach ~85%

    const tick = () => {
      const elapsed = Date.now() - startTime.current;

      if (doneRef.current) {
        // Animate quickly to 100
        setDisplayPct((prev) => {
          if (prev >= 100) return 100;
          return Math.min(100, prev + 2.5);
        });
      } else {
        // Ease-out curve: fast at start, slows toward 85%
        const t = Math.min(elapsed / DURATION, 1);
        const eased = 1 - Math.pow(1 - t, 2.5); // ease-out
        const simulated = eased * 85;
        setDisplayPct(Math.round(simulated));
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const pct = Math.min(100, displayPct);

  // Fun fact
  const [fact, setFact] = useState(() => getRandomFact());
  useEffect(() => {
    const id = setInterval(() => setFact((p) => getRandomFact(p.index)), 7000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={styles.container}>
      <ScissorAnimation />

      <div className={styles.progressCard}>
        <div className={styles.row}>
          <span className={styles.status}>{getStatusLine(pct)}</span>
          <span className={styles.pct}>{pct}%</span>
        </div>
        <div className={styles.track}>
          <div className={styles.fill} style={{ width: `${pct}%` }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={fact.index}
          className={styles.factCard}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
        >
          <div className={styles.factHead}>
            <Sparkles size={10} className={styles.spark} />
            <span className={styles.factLabel}>{fact.title}</span>
            <span className={styles.factYear}>{fact.year}</span>
          </div>
          <p className={styles.factBody}>{fact.fact}</p>
          <div className={styles.factTag}>
            <Tag size={9} /> <span>{fact.category}</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LoadingWithFacts;

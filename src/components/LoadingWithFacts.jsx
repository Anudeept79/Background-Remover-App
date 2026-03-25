import React, { useState, useEffect } from 'react';
import { Loader2, Sparkles, Clock, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRandomFact } from '../utils/techFacts';
import styles from './LoadingWithFacts.module.css';

const LoadingWithFacts = () => {
  const [fact, setFact] = useState(() => getRandomFact());
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const factInterval = setInterval(() => {
      setFact((prev) => getRandomFact(prev.index));
    }, 6000);

    const timerInterval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(factInterval);
      clearInterval(timerInterval);
    };
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.spinnerSection}>
        <div className={styles.spinnerOuter}>
          <div className={styles.spinner} />
          <Loader2 size={18} className={styles.spinnerIcon} />
        </div>
        <div className={styles.statusText}>
          <p className={styles.statusTitle}>Removing background...</p>
          <p className={styles.statusMeta}>
            <Clock size={11} />
            {formatTime(elapsed)} elapsed — processing in your browser
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={fact.index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className={styles.factCard}
        >
          <div className={styles.factHeader}>
            <Sparkles size={12} className={styles.sparkle} />
            <span className={styles.factLabel}>Did you know?</span>
            <span className={styles.factYear}>{fact.year}</span>
          </div>
          <h3 className={styles.factTitle}>{fact.title}</h3>
          <p className={styles.factBody}>{fact.fact}</p>
          <div className={styles.factFooter}>
            <Tag size={10} />
            <span>{fact.category}</span>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className={styles.progressHint}>
        <div className={styles.dots}>
          <span className={styles.dot} style={{ animationDelay: '0s' }} />
          <span className={styles.dot} style={{ animationDelay: '0.2s' }} />
          <span className={styles.dot} style={{ animationDelay: '0.4s' }} />
        </div>
        <span className={styles.hintText}>New fact every 6 seconds</span>
      </div>
    </div>
  );
};

export default LoadingWithFacts;

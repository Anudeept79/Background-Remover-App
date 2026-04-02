import React from 'react';
import { Scissors } from 'lucide-react';
import styles from './ScissorAnimation.module.css';

/**
 * Isometric cartoon-style animation of scissors cutting
 * the background away from an image.
 *
 * Shows:
 * 1. A tilted card with a gradient "photo" background
 * 2. A person silhouette (subject)
 * 3. Scissors sweeping across, cutting away the background
 * 4. Checkerboard transparency revealed underneath
 * 5. Loops smoothly
 */
const ScissorAnimation = () => (
  <div className={styles.scene}>
    <div className={styles.card}>
      {/* Transparency checkerboard (revealed after cut) */}
      <div className={styles.checkerboard} />

      {/* Person silhouette — stays visible after cut */}
      <svg className={styles.silhouette} viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Head */}
        <circle cx="60" cy="38" r="22" fill="rgba(255,255,255,0.18)" />
        {/* Body/shoulders */}
        <path d="M20 140 C20 95 100 95 100 140" fill="rgba(255,255,255,0.13)" />
        {/* Subtle neck */}
        <rect x="52" y="58" width="16" height="14" rx="4" fill="rgba(255,255,255,0.11)" />
      </svg>

      {/* Background layer that gets "cut away" */}
      <div className={styles.bgLayer} />

      {/* Dashed cut guide */}
      <div className={styles.cutGuide} />

      {/* Scissors moving across */}
      <div className={styles.scissorTrack}>
        <div className={styles.scissorWrapper}>
          <Scissors size={18} />
        </div>
      </div>

      {/* Sparkle particles after cut */}
      <div className={styles.sparkles}>
        <span className={styles.sparkle} style={{ '--delay': '0.2s', '--x': '25%', '--y': '30%' }} />
        <span className={styles.sparkle} style={{ '--delay': '0.5s', '--x': '65%', '--y': '20%' }} />
        <span className={styles.sparkle} style={{ '--delay': '0.8s', '--x': '45%', '--y': '70%' }} />
        <span className={styles.sparkle} style={{ '--delay': '1.1s', '--x': '80%', '--y': '55%' }} />
      </div>
    </div>
  </div>
);

export default ScissorAnimation;

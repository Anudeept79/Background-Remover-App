import React from 'react';
import { Lock, Eye, Feather, Heart, Code, Scale, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './Principles.module.css';

const principles = [
  {
    icon: Lock,
    title: 'Privacy First',
    body: 'Your images are yours. ClearCut processes everything locally in your browser using WebAssembly. No image ever leaves your device — no uploads, no cloud storage, no server-side processing. We don\'t collect, store, or analyze your data.',
    highlight: 'Zero data collection. Zero tracking. Zero cookies.'
  },
  {
    icon: Eye,
    title: 'Transparency',
    body: 'There are no hidden processes. The AI model, the runtime, and the processing pipeline are all open standards. We use the @imgly/background-removal library built on ONNX Runtime — open-source tools you can inspect yourself.',
    highlight: 'Open-source stack. Nothing proprietary. Nothing hidden.'
  },
  {
    icon: Feather,
    title: 'Simplicity',
    body: 'Background removal should be one action, not a workflow. No accounts, no sign-ups, no credit cards, no watermarks. Upload an image, get a result. We deliberately avoid feature bloat — every element on screen earns its place.',
    highlight: 'One task, done well.'
  },
  {
    icon: Heart,
    title: 'Free for Everyone',
    body: 'ClearCut is free to use with no limits. There\'s no freemium tier, no "pro" upgrade, and no per-image charges. Because processing runs on your hardware, our costs are near zero — and we pass that on to you.',
    highlight: 'No limits. No subscriptions. No upsells.'
  },
  {
    icon: Code,
    title: 'Modern Web Standards',
    body: 'We bet on the open web. ClearCut is built with React, Vite, WebAssembly, and ONNX Runtime — technologies standardized across browsers. No plugins, no extensions, no Flash. If your browser is modern, it just works.',
    highlight: 'Built on standards that will outlast any single company.'
  },
  {
    icon: Scale,
    title: 'Honest Design',
    body: 'No dark patterns. No pop-ups asking you to subscribe. No artificial delays to make the free tier feel slow. No fake "processing" animations to make it seem more complex. The tool does exactly what it says, as fast as your hardware allows.',
    highlight: 'What you see is what you get.'
  }
];

const Principles = ({ onBack }) => {
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
        <h1 className={styles.title}>Principles</h1>
        <p className={styles.subtitle}>
          The beliefs and commitments that shape how ClearCut is built. These aren't marketing — they're constraints we design around.
        </p>
      </div>

      <div className={styles.principlesList}>
        {principles.map((item, i) => (
          <motion.div
            key={i}
            className={styles.principleCard}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <div className={styles.cardHeader}>
              <div className={styles.iconBadge}>
                <item.icon size={16} />
              </div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
            </div>
            <p className={styles.cardBody}>{item.body}</p>
            <div className={styles.cardHighlight}>
              {item.highlight}
            </div>
          </motion.div>
        ))}
      </div>

      <div className={styles.sectionDivider} />

      <div className={styles.footer}>
        <h2 className={styles.footerTitle}>The tech stack</h2>
        <div className={styles.stackGrid}>
          {[
            { name: 'React 19', role: 'UI framework' },
            { name: 'Vite 7', role: 'Build tool' },
            { name: 'ONNX Runtime', role: 'AI inference engine' },
            { name: 'WebAssembly', role: 'Near-native execution' },
            { name: '@imgly/background-removal', role: 'AI model & pipeline' },
            { name: 'Framer Motion', role: 'Animations' },
          ].map((tech, i) => (
            <motion.div
              key={i}
              className={styles.stackItem}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.05 }}
            >
              <span className={styles.stackName}>{tech.name}</span>
              <span className={styles.stackRole}>{tech.role}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Principles;

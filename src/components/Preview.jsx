import React, { useState } from 'react';
import { Download, RefreshCw, ThumbsUp, ThumbsDown, Check, Pencil } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Preview.module.css';
import confetti from 'canvas-confetti';

const Preview = ({ original, processed, onReset, onEdit }) => {
    const [feedback, setFeedback] = useState(null);

    const handleDownload = () => {
        if (!processed) return;
        const link = document.createElement('a');
        link.href = processed;
        link.download = 'clearcut-image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadAndReturn = () => {
        handleDownload();
        setTimeout(() => onReset(), 600);
    };

    const handleLike = () => {
        setFeedback('liked');
        confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#635bff', '#818CF8', '#ffffff']
        });
    };

    const handleDislike = () => {
        setFeedback('disliked');
    };

    return (
        <div className={styles.container}>
            <motion.div
                className={styles.grid}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className={styles.card}>
                    <div className={styles.header}>
                        <span className={styles.badge}>Original</span>
                    </div>
                    <div className={styles.imageWrapper}>
                        <img src={original} alt="Original" className={styles.image} />
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.header}>
                        <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                            <Check size={10} style={{ marginRight: 3 }} />
                            Background Removed
                        </span>
                    </div>
                    <div className={`${styles.imageWrapper} ${styles.transparentBg}`}>
                        <img src={processed} alt="Processed" className={styles.image} />
                    </div>
                </div>
            </motion.div>

            <div className={styles.footer}>
                <AnimatePresence mode="wait">

                    {feedback === null && (
                        <motion.div
                            key="feedback"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className={styles.feedbackContainer}
                        >
                            <h3 className={styles.feedbackTitle}>How is the result?</h3>
                            <div className={styles.feedbackButtons}>
                                <button
                                    className={`${styles.feedbackBtn} ${styles.dislikeBtn}`}
                                    onClick={handleDislike}
                                >
                                    <ThumbsDown size={14} />
                                    <span>Not Good</span>
                                </button>
                                <button
                                    className={`${styles.feedbackBtn} ${styles.likeBtn}`}
                                    onClick={handleLike}
                                >
                                    <ThumbsUp size={14} />
                                    <span>It's Great!</span>
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {feedback === 'liked' && (
                        <motion.div
                            key="download"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={styles.actions}
                        >
                            <div className={styles.successMessage}>
                                <span>Glad you liked it!</span>
                            </div>
                            <div className={styles.buttonGroup}>
                                <button className="btn btn-secondary" onClick={onReset}>
                                    <RefreshCw size={14} />
                                    New Image
                                </button>
                                <button className="btn btn-secondary" onClick={onEdit}>
                                    <Pencil size={14} />
                                    Edit
                                </button>
                                <button className="btn btn-primary" onClick={handleDownload}>
                                    <Download size={14} />
                                    Download PNG
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {feedback === 'disliked' && (
                        <motion.div
                            key="retry"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={styles.actions}
                        >
                            <div className={styles.errorMessage}>
                                <span>AI is still learning — try a different image.</span>
                            </div>
                            <div className={styles.buttonGroup}>
                                <button className="btn btn-secondary" onClick={onReset}>
                                    <RefreshCw size={14} />
                                    Try Another
                                </button>
                                <button className="btn btn-secondary" onClick={onEdit}>
                                    <Pencil size={14} />
                                    Edit Anyway
                                </button>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
};

export default Preview;

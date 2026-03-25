import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ImageUploader.module.css';

const ImageUploader = ({ onUpload }) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            validateAndUpload(files[0]);
        }
    };

    const handleFileSelect = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            validateAndUpload(files[0]);
        }
    };

    const validateAndUpload = (file) => {
        if (!file.type.match('image.*')) {
            alert('Please upload an image file (JPG, PNG, WebP)');
            return;
        }
        onUpload(file);
    };

    return (
        <div className={styles.wrapper}>
            <motion.div
                className={`${styles.dropzone} ${isDragging ? styles.active : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/png, image/jpeg, image/webp"
                    hidden
                />

                <div className={styles.content}>
                    <div className={styles.iconWrapper}>
                        <UploadCloud size={22} className={styles.uploadIcon} />
                    </div>
                    <h3 className={styles.title}>Upload an image</h3>
                    <p className={styles.subtitle}>
                        Drag & drop or click to upload
                    </p>
                    <div className={styles.meta}>
                        JPG, PNG, WebP • Max 10MB
                    </div>
                </div>

                <div className={`${styles.overlay} ${isDragging ? styles.showOverlay : ''}`}>
                    <div className={styles.overlayContent}>
                        <ImageIcon size={28} className={styles.bounce} />
                        <p>Drop to remove background!</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ImageUploader;

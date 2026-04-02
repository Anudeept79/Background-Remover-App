import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './ImageUploader.module.css';

const MAX_FILE_SIZE_MB = 10;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const ImageUploader = ({ onUpload, onError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const validateAndUpload = (file) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      onError?.('Please upload a JPG, PNG, or WebP image.');
      return;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      onError?.(`Image must be under ${MAX_FILE_SIZE_MB} MB.`);
      return;
    }
    onUpload(file);
  };

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
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndUpload(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) validateAndUpload(file);
    // Reset so same file can be re-selected after an error
    e.target.value = '';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={styles.wrapper}>
      <motion.div
        className={`${styles.dropzone} ${isDragging ? styles.active : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label="Upload image — click or drag and drop"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/png,image/jpeg,image/webp"
          hidden
        />

        <div className={styles.content}>
          <div className={styles.iconWrapper}>
            <UploadCloud size={24} className={styles.uploadIcon} />
          </div>
          <h3 className={styles.title}>Upload an image</h3>
          <p className={styles.subtitle}>Drag & drop or tap to upload</p>
          <div className={styles.meta}>JPG · PNG · WebP &nbsp;·&nbsp; Max {MAX_FILE_SIZE_MB} MB</div>
        </div>

        {/* Drag-over overlay */}
        <div className={`${styles.overlay} ${isDragging ? styles.showOverlay : ''}`}>
          <div className={styles.overlayContent}>
            <ImageIcon size={30} className={styles.bounce} />
            <p>Drop to remove background!</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ImageUploader;

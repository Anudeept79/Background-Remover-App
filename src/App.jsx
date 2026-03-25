import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ImageUploader from './components/ImageUploader';
import Preview from './components/Preview';
import ImageEditor from './components/ImageEditor';
import LoadingWithFacts from './components/LoadingWithFacts';
import HowItWorks from './components/HowItWorks';
import Principles from './components/Principles';
import { processImage } from './utils/bgRemover';
import { X, Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';

function App() {
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState('home'); // 'home' | 'how-it-works' | 'principles'

  const handleUpload = (file) => {
    const objectUrl = URL.createObjectURL(file);
    setOriginalImage(objectUrl);
    setProcessedImage(null);
    setIsEditing(false);
    setError(null);
  };

  const handleProcess = async () => {
    if (!originalImage) return;

    setIsProcessing(true);
    setError(null);

    try {
      const processedUrl = await processImage(originalImage);
      setProcessedImage(processedUrl);
    } catch (err) {
      console.error(err);
      setError('Failed to remove background. Please try another image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setIsEditing(false);
    setError(null);
    setPage('home');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleEditorBack = () => {
    setIsEditing(false);
  };

  const handleEditorDone = () => {
    setIsEditing(false);
  };

  const handleNavigate = (target) => {
    setPage(page === target ? 'home' : target);
  };

  const handleBackToHome = () => {
    setPage('home');
  };

  return (
    <>
      <Navbar
        onLogoClick={handleReset}
        onNavigate={handleNavigate}
        activePage={page}
      />

      <main className="container" style={{ flex: 1, paddingTop: '2.5rem', paddingBottom: '2rem' }}>

        {page === 'how-it-works' && (
          <HowItWorks onBack={handleBackToHome} />
        )}

        {page === 'principles' && (
          <Principles onBack={handleBackToHome} />
        )}

        {page === 'home' && (
          <>
            {!originalImage && !isProcessing && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', marginBottom: '2rem' }}
              >
                <h1 style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  marginBottom: '0.5rem',
                  lineHeight: 1.2,
                  letterSpacing: '-0.025em',
                  color: 'var(--color-text-main)'
                }}>
                  Remove Backgrounds{' '}
                  <span className="text-gradient">in Seconds</span>
                </h1>
                <p style={{
                  fontSize: '0.9375rem',
                  color: 'var(--color-text-muted)',
                  maxWidth: '480px',
                  margin: '0 auto'
                }}>
                  Free, private, and automatic. Powered by AI running directly in your browser.
                </p>
              </motion.div>
            )}

            <div style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

              {!originalImage && !isProcessing && (
                <ImageUploader onUpload={handleUpload} />
              )}

              {originalImage && !processedImage && !isProcessing && !error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="card"
                  style={{
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                    maxWidth: '380px',
                    width: '100%',
                  }}
                >
                  <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Ready to process</p>

                  <div style={{
                    width: '100%',
                    aspectRatio: '4 / 3',
                    backgroundColor: '#0c0c12',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--color-border)'
                  }}>
                    <img
                      src={originalImage}
                      alt="Original"
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                    <button
                      className="btn btn-secondary"
                      onClick={handleReset}
                      style={{ flex: 1 }}
                    >
                      <X size={14} />
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={handleProcess}
                      style={{ flex: 1 }}
                    >
                      <Wand2 size={14} />
                      Remove Background
                    </button>
                  </div>
                </motion.div>
              )}

              {isProcessing && (
                <LoadingWithFacts />
              )}

              {originalImage && processedImage && !isProcessing && !isEditing && (
                <Preview
                  original={originalImage}
                  processed={processedImage}
                  onReset={handleReset}
                  onEdit={handleEdit}
                />
              )}

              {isEditing && processedImage && (
                <ImageEditor
                  imageSrc={processedImage}
                  onBack={handleEditorBack}
                  onDone={handleEditorDone}
                />
              )}

              {error && (
                <div style={{ textAlign: 'center' }}>
                  <p style={{ color: '#F87171', marginBottom: '0.75rem', fontSize: '0.8125rem' }}>{error}</p>
                  <button className="btn btn-secondary" onClick={handleReset}>Try Again</button>
                </div>
              )}

            </div>
          </>
        )}

      </main>

      <footer style={{
        textAlign: 'center',
        padding: '1rem 0',
        fontSize: '0.75rem',
        color: 'var(--color-text-muted)',
        borderTop: '1px solid var(--color-border)',
        marginTop: 'auto'
      }}>
        <p>&copy; {new Date().getFullYear()} ClearCut. All rights reserved.</p>
      </footer>
    </>
  );
}

export default App;

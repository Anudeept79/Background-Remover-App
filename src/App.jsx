import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import ImageUploader from './components/ImageUploader';
import Preview from './components/Preview';
import ImageEditor from './components/ImageEditor';
import LoadingWithFacts from './components/LoadingWithFacts';
import HowItWorks from './components/HowItWorks';
import Principles from './components/Principles';
import { processImage, preloadModel } from './utils/bgRemover';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Image as ImageIcon } from 'lucide-react';

function App() {
  useEffect(() => { preloadModel(); }, []);

  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [page, setPage] = useState('home');

  // History of processed images (current session)
  const [history, setHistory] = useState([]);
  const fileInputRef = useRef(null);

  // ── Upload & process (used from uploader, "+" button, and history) ──
  const handleUpload = async (file) => {
    // Save current result to history before starting new one
    saveCurrentToHistory();

    const objectUrl = URL.createObjectURL(file);
    setOriginalImage(objectUrl);
    setProcessedImage(null);
    setIsEditing(false);
    setError(null);
    setProgress(0);
    setIsProcessing(true);

    try {
      const processedUrl = await processImage(objectUrl, setProgress);
      setProcessedImage(processedUrl);
    } catch (err) {
      console.error(err);
      setError('Failed to remove background. Please try another image.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Save current pair to history (if exists)
  const saveCurrentToHistory = () => {
    if (originalImage && processedImage) {
      setHistory((prev) => {
        // Don't duplicate
        if (prev.some((h) => h.originalUrl === originalImage)) return prev;
        const entry = {
          id: Date.now(),
          originalUrl: originalImage,
          processedUrl: processedImage,
        };
        // Keep max 8 entries
        const next = [entry, ...prev].slice(0, 8);
        return next;
      });
    }
  };

  // Load a history item back into the preview
  const handleLoadHistory = (item) => {
    saveCurrentToHistory();
    setOriginalImage(item.originalUrl);
    setProcessedImage(item.processedUrl);
    setIsEditing(false);
    setError(null);
  };

  // "+" button triggers a hidden file input
  const handleAddNew = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const types = ['image/jpeg', 'image/png', 'image/webp'];
      if (!types.includes(file.type)) {
        setError('Please upload a JPG, PNG, or WebP image.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('Image must be under 10 MB.');
        return;
      }
      handleUpload(file);
    }
    e.target.value = '';
  };

  const handleReset = () => {
    saveCurrentToHistory();
    setOriginalImage(null);
    setProcessedImage(null);
    setIsEditing(false);
    setError(null);
    setProgress(0);
  };

  const handleEditorDone = (newImageUrl) => {
    if (newImageUrl) {
      if (processedImage) URL.revokeObjectURL(processedImage);
      setProcessedImage(newImageUrl);
    }
    setIsEditing(false);
  };

  const handleNavigate = (target) => {
    setPage(page === target ? 'home' : target);
  };

  const showUploader = !originalImage && !isProcessing && !error;

  return (
    <>
      <Navbar onLogoClick={handleReset} onNavigate={handleNavigate} activePage={page} />

      {/* Hidden file input for "+" button */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/png,image/jpeg,image/webp"
        hidden
      />

      <main className="container" style={{ flex: 1, paddingTop: '1.75rem', paddingBottom: '2rem' }}>

        {page === 'how-it-works' && <HowItWorks onBack={() => setPage('home')} />}
        {page === 'principles' && <Principles onBack={() => setPage('home')} />}

        {page === 'home' && (
          <>
            {/* Hero text — only when uploader is visible */}
            {showUploader && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', marginBottom: '1.5rem' }}
              >
                <h1 style={{
                  fontSize: 'clamp(1.4rem, 5vw, 2rem)',
                  fontWeight: 700,
                  marginBottom: '0.5rem',
                  lineHeight: 1.2,
                  letterSpacing: '-0.025em',
                  color: 'var(--color-text-main)'
                }}>
                  Remove Backgrounds{' '}
                  <span className="text-gradient">Instantly</span>
                </h1>
                <p style={{
                  fontSize: '0.9rem',
                  color: 'var(--color-text-muted)',
                  maxWidth: '440px',
                  margin: '0 auto',
                  lineHeight: 1.6,
                }}>
                  AI-powered background removal that runs entirely on your device. No sign-up needed.
                </p>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginTop: '0.625rem',
                  fontSize: '0.6875rem',
                  color: 'var(--color-text-muted)',
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span style={{ color: '#34D399' }}>&#10003;</span> 100% private
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span style={{ color: '#34D399' }}>&#10003;</span> No sign-up
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span style={{ color: '#34D399' }}>&#10003;</span> Completely free
                  </span>
                </div>
              </motion.div>
            )}

            {/* ── Main content area ── */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '260px' }}>

              {showUploader && (
                <ImageUploader onUpload={handleUpload} onError={setError} />
              )}

              {isProcessing && (
                <LoadingWithFacts progress={progress} />
              )}

              {originalImage && processedImage && !isProcessing && !isEditing && (
                <Preview
                  original={originalImage}
                  processed={processedImage}
                  onReset={handleReset}
                  onEdit={() => setIsEditing(true)}
                  onAddNew={handleAddNew}
                />
              )}

              {isEditing && processedImage && (
                <ImageEditor
                  imageSrc={processedImage}
                  onBack={() => setIsEditing(false)}
                  onDone={handleEditorDone}
                />
              )}

              {error && !isProcessing && (
                <div style={{ textAlign: 'center' }}>
                  <p style={{ color: '#F87171', marginBottom: '0.75rem', fontSize: '0.8125rem' }}>{error}</p>
                  <button className="btn btn-secondary" onClick={() => { setError(null); handleReset(); }}>
                    Try Again
                  </button>
                </div>
              )}
            </div>

            {/* ── Recent images strip ── */}
            {history.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  marginTop: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span style={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--color-text-muted)',
                }}>
                  Recent
                </span>
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  {/* "+" add new button */}
                  <button
                    onClick={handleAddNew}
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px dashed var(--color-border)',
                      background: 'var(--color-surface)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: 'var(--color-text-muted)',
                      transition: 'all 0.15s',
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-primary)';
                      e.currentTarget.style.color = 'var(--color-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-border)';
                      e.currentTarget.style.color = 'var(--color-text-muted)';
                    }}
                    title="Process another image"
                  >
                    <Plus size={20} />
                  </button>

                  {/* History thumbnails */}
                  {history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleLoadHistory(item)}
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 'var(--radius-md)',
                        border: item.originalUrl === originalImage
                          ? '2px solid var(--color-primary)'
                          : '1px solid var(--color-border)',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        padding: 0,
                        background: 'var(--color-surface)',
                        flexShrink: 0,
                        transition: 'border-color 0.15s, transform 0.15s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                      title="Load this image"
                    >
                      <img
                        src={item.processedUrl}
                        alt=""
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}
      </main>

      <footer style={{
        textAlign: 'center',
        padding: '0.75rem 0',
        fontSize: '0.6875rem',
        color: 'var(--color-text-muted)',
        borderTop: '1px solid var(--color-border)',
        marginTop: 'auto',
      }}>
        <p>&copy; {new Date().getFullYear()} ClearCut. All rights reserved.</p>
      </footer>
    </>
  );
}

export default App;

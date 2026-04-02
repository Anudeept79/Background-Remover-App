import React, { useState, useEffect, useRef } from 'react';
import { Layers, Menu, X } from 'lucide-react';
import styles from './Navbar.module.css';

const Navbar = ({ onLogoClick, onNavigate, activePage }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  // Close menu on nav link press
  const handleNavigate = (target) => {
    setMenuOpen(false);
    onNavigate(target);
  };

  return (
    <nav className={styles.nav} ref={menuRef}>
      <div className={`container ${styles.container}`}>
        {/* Logo */}
        <div className={styles.logo} onClick={() => { setMenuOpen(false); onLogoClick(); }} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') { setMenuOpen(false); onLogoClick(); } }} aria-label="ClearCut home">
          <div className={styles.icon}>
            <Layers size={15} color="white" />
          </div>
          <span className={styles.brandName}>
            Clear<span className={styles.highlight}>Cut</span>
          </span>
        </div>

        {/* Desktop nav links */}
        <div className={styles.links}>
          <button
            className={`${styles.link} ${activePage === 'how-it-works' ? styles.linkActive : ''}`}
            onClick={() => handleNavigate('how-it-works')}
          >
            How it works
          </button>
          <button
            className={`${styles.link} ${activePage === 'principles' ? styles.linkActive : ''}`}
            onClick={() => handleNavigate('principles')}
          >
            Principles
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          <button
            className={`${styles.mobileLink} ${activePage === 'how-it-works' ? styles.mobileLinkActive : ''}`}
            onClick={() => handleNavigate('how-it-works')}
          >
            How it works
          </button>
          <button
            className={`${styles.mobileLink} ${activePage === 'principles' ? styles.mobileLinkActive : ''}`}
            onClick={() => handleNavigate('principles')}
          >
            Principles
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

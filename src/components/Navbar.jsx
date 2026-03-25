import React from 'react';
import { Layers } from 'lucide-react';
import styles from './Navbar.module.css';

const Navbar = ({ onLogoClick, onNavigate, activePage }) => {
    return (
        <nav className={styles.nav}>
            <div className={`container ${styles.container}`}>
                <div className={styles.logo} onClick={onLogoClick}>
                    <div className={styles.icon}>
                        <Layers size={16} color="white" />
                    </div>
                    <span className={styles.brandName}>
                        Clear<span className={styles.highlight}>Cut</span>
                    </span>
                </div>
                <div className={styles.links}>
                    <button
                        className={`${styles.link} ${activePage === 'how-it-works' ? styles.linkActive : ''}`}
                        onClick={() => onNavigate('how-it-works')}
                    >
                        How it works
                    </button>
                    <button
                        className={`${styles.link} ${activePage === 'principles' ? styles.linkActive : ''}`}
                        onClick={() => onNavigate('principles')}
                    >
                        Principles
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

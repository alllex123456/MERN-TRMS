import React, { useState } from 'react';

import { Link } from 'react-router-dom';

import styles from './Header.module.css';
import { MobileNav } from './MobileNav';

export const Header = () => {
  const [showMobileNav, setShowMobileNav] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.headerName}>
        <button
          className={styles.navigationButton}
          onClick={() => setShowMobileNav(true)}
        >
          <span />
          <span />
          <span />
        </button>
        <h1>TRMS</h1>
      </div>

      <MobileNav
        showMobileNav={showMobileNav}
        onClick={() => setShowMobileNav(false)}
      />

      <Link to="/" className={styles.userBar}>
        <div className={styles.userAvatar}>
          <img src="./images/avatar.jpg" alt="" />
        </div>
        <div className={styles.userName}>UTILIZATOR</div>
      </Link>
    </header>
  );
};

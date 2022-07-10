import React from 'react';

import { Link } from 'react-router-dom';

import styles from './Header.module.css';

export const Header = () => {
  return (
    <header className={styles.header}>
      <h1>TRMS</h1>
      <Link to="/" className={styles.userBar}>
        <div className={styles.userAvatar}>
          <img src="./images/avatar.jpg" alt="" />
        </div>
        <div className={styles.userName}>UTILIZATOR</div>
      </Link>
    </header>
  );
};

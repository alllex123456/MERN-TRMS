import React from 'react';

import { Header } from './Header';
import { Navigation } from './Navigation';

import styles from './MainLayout.module.css';

export const MainLayout = (props) => {
  return (
    <div className={styles.mainLayout}>
      <Header />
      <Navigation />
      <main className={styles.mainContent}>{props.children}</main>
    </div>
  );
};

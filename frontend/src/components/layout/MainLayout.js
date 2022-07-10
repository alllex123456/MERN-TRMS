import React from 'react';
import { Header } from './Header';

import styles from './MainLayout.module.css';
import { Navigation } from './Navigation';

export const MainLayout = (props) => {
  return (
    <div className={styles.mainLayout}>
      <Header />
      <Navigation />
      <main className={styles.mainContent}>{props.children}</main>
    </div>
  );
};

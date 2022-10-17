import React, { useContext } from 'react';

import { Header } from './Header';
import { Navigation } from './Navigation';

import styles from './MainLayout.module.css';
import { AuthContext } from '../../context/auth-context';

export const MainLayout = (props) => {
  const { theme } = useContext(AuthContext);

  return (
    <div className={styles.mainLayout}>
      <Header />
      <Navigation />
      <main
        className={`${styles.mainContent} ${styles[`${theme}MainContent`]}`}
      >
        {props.children}
      </main>
    </div>
  );
};

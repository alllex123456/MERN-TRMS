import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  AppWindow,
  Hourglass,
  AddressBook,
  Activity,
  BookOpen,
  User,
} from 'phosphor-react';

import styles from './Navigation.module.css';

export const Navigation = () => {
  const activeLinks = ({ isActive }) =>
    isActive
      ? `${styles.linkActive} ${styles.navigationItem}`
      : styles.navigationItem;

  return (
    <nav className={styles.navigation}>
      <ul className={styles.navigationList}>
        <li>
          <NavLink className={activeLinks} to="/">
            <AppWindow size={32} className={styles.icon} />
            <p className={styles.link}>PANOU DE BORD</p>
          </NavLink>
        </li>
        <li>
          <NavLink className={activeLinks} to="/queue">
            <Hourglass size={32} className={styles.icon} />
            <p className={styles.link}>COMENZI ÎN LUCRU</p>
          </NavLink>
        </li>
        <li>
          <NavLink className={activeLinks} to="/clients">
            <AddressBook size={32} className={styles.icon} />
            <p className={styles.link}>CLIENȚI</p>
          </NavLink>
        </li>
        <li>
          <NavLink className={activeLinks} to="/statements">
            <BookOpen size={32} className={styles.icon} />
            <p className={styles.link}>SITUAȚII CLIENȚI</p>
          </NavLink>
        </li>
        <li>
          <NavLink className={activeLinks} to="/statistics">
            <Activity size={32} className={styles.icon} />
            <p className={styles.link}>STATISTICI DE LUCRU</p>
          </NavLink>
        </li>
      </ul>

      <ul className={styles.profileList}>
        <li>
          <NavLink className={styles.profileItem} to="/">
            <User size={32} className={styles.icon} />
            <p className={styles.link}>PROFIL</p>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

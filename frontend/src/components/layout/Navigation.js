import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import {
  AppWindow,
  Hourglass,
  AddressBook,
  Activity,
  BookOpen,
  User,
  Money,
} from 'phosphor-react';
import { AuthContext } from '../../context/auth-context';

import styles from './Navigation.module.css';

export const Navigation = () => {
  const { theme, avatar } = useContext(AuthContext);
  const activeLinks = ({ isActive }) =>
    isActive
      ? `${styles.linkActive} ${styles.navigationItem}`
      : styles.navigationItem;

  return (
    <nav className={`${styles.navigation} ${styles[`${theme}Navigation`]}`}>
      <ul className={styles.navigationList}>
        <li>
          <NavLink className={activeLinks} to="/main">
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
          <NavLink className={activeLinks} to="/invoicing">
            <Money size={32} className={styles.icon} />
            <p className={styles.link}>FACTURI</p>
          </NavLink>
        </li>
        <li>
          <NavLink className={activeLinks} to="/metrics">
            <Activity size={32} className={styles.icon} />
            <p className={styles.link}>DATE DE LUCRU</p>
          </NavLink>
        </li>
      </ul>

      <ul className={styles.profileList}>
        <li>
          <NavLink className={styles.profileItem} to="/profile">
            <div className={styles.userAvatar}>
              {avatar ? (
                <img src={`http://localhost:8000/uploads/avatars/${avatar}`} />
              ) : (
                <div className="blankAvatar" />
              )}
            </div>
            <p className={styles.link}>PROFIL</p>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

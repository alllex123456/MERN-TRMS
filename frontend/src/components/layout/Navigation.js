import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import {
  AppWindow,
  Hourglass,
  AddressBook,
  Activity,
  BookOpen,
  Money,
} from 'phosphor-react';
import { useTranslation } from 'react-i18next';

import { AuthContext } from '../../context/auth-context';

import styles from './Navigation.module.css';

export const Navigation = () => {
  const { theme, avatar } = useContext(AuthContext);

  const { t } = useTranslation();

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
            <p className={styles.link}>
              {t('navigation.dashboard').toUpperCase()}
            </p>
          </NavLink>
        </li>
        <li>
          <NavLink className={activeLinks} to="/queue">
            <Hourglass size={32} className={styles.icon} />
            <p className={styles.link}>
              {t('navigation.pendingOrders').toUpperCase()}
            </p>
          </NavLink>
        </li>
        <li>
          <NavLink className={activeLinks} to="/clients">
            <AddressBook size={32} className={styles.icon} />
            <p className={styles.link}>
              {t('navigation.clients').toUpperCase()}
            </p>
          </NavLink>
        </li>
        <li>
          <NavLink className={activeLinks} to="/statements">
            <BookOpen size={32} className={styles.icon} />
            <p className={styles.link}>
              {t('navigation.clientStatements').toUpperCase()}
            </p>
          </NavLink>
        </li>
        <li>
          <NavLink className={activeLinks} to="/invoicing">
            <Money size={32} className={styles.icon} />
            <p className={styles.link}>
              {t('navigation.invoicing').toUpperCase()}
            </p>
          </NavLink>
        </li>
        <li>
          <NavLink className={activeLinks} to="/metrics">
            <Activity size={32} className={styles.icon} />
            <p className={styles.link}>
              {t('navigation.metrics').toUpperCase()}
            </p>
          </NavLink>
        </li>
      </ul>

      <ul className={styles.profileList}>
        <li>
          <NavLink className={styles.profileItem} to="/profile">
            <div className={styles.userAvatar}>
              {avatar ? (
                <img
                  src={`${process.env.REACT_APP_BACKEND_URL}/uploads/avatars/${avatar}`}
                />
              ) : (
                <div className="blankAvatar" />
              )}
            </div>
            <p className={styles.link}>
              {t('navigation.profile').toUpperCase()}
            </p>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

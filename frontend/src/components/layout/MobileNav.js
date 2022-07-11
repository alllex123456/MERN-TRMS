import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { NavLink } from 'react-router-dom';
import {
  AppWindow,
  Hourglass,
  AddressBook,
  Activity,
  BookOpen,
  User,
  Gear,
} from 'phosphor-react';

import styles from './MobileNav.module.css';
import '../../index.css';

export const MobileNav = (props) => {
  const activeLinks = ({ isActive }) =>
    isActive
      ? `${styles.linkActive} ${styles.navigationItem}`
      : styles.navigationItem;

  return (
    <CSSTransition
      classNames="slide-in-left"
      in={props.showMobileNav}
      timeout={200}
      mountOnEnter
      unmountOnExit
    >
      <nav className={styles.mobileNavigation}>
        <ul className={styles.mobileNavigationList}>
          <li>
            <NavLink onClick={props.onClick} className={activeLinks} to="/">
              <AppWindow size={32} className={styles.icon} />
              <p className={styles.link}>PANOU DE BORD</p>
            </NavLink>
          </li>
          <li>
            <NavLink
              onClick={props.onClick}
              className={activeLinks}
              to="/queue"
            >
              <Hourglass size={32} className={styles.icon} />
              <p className={styles.link}>COMENZI IN LUCRU</p>
            </NavLink>
          </li>
          <li>
            <NavLink
              onClick={props.onClick}
              className={activeLinks}
              to="/clients"
            >
              <AddressBook size={32} className={styles.icon} />
              <p className={styles.link}>CLIENTI</p>
            </NavLink>
          </li>
          <li>
            <NavLink
              onClick={props.onClick}
              className={activeLinks}
              to="/statements"
            >
              <BookOpen size={32} className={styles.icon} />
              <p className={styles.link}>SITUATII CLIENTI</p>
            </NavLink>
          </li>
          <li>
            <NavLink
              onClick={props.onClick}
              className={activeLinks}
              to="/statistics"
            >
              <Activity size={32} className={styles.icon} />
              <p className={styles.link}>STATISTICI DE LUCRU</p>
            </NavLink>
          </li>
        </ul>

        <ul className={styles.profileList}>
          <li>
            <NavLink
              onClick={props.onClick}
              className={styles.profileItem}
              to="/"
            >
              <User size={32} className={styles.icon} />
              <p className={styles.link}>PROFIL</p>
            </NavLink>
          </li>
          <li>
            <NavLink
              onClick={props.onClick}
              className={styles.profileItem}
              to="/"
            >
              <Gear size={32} className={styles.icon} />
              <p className={styles.link}>SETARI</p>
            </NavLink>
          </li>
        </ul>
      </nav>
    </CSSTransition>
  );
};
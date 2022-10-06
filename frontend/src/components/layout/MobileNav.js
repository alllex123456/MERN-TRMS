import React, { Fragment } from 'react';
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
  Money,
} from 'phosphor-react';

import Backdrop from '../COMMON/UIElements/Backdrop';

import styles from './MobileNav.module.css';
import '../../index.css';

export const MobileNav = (props) => {
  const activeLinks = ({ isActive }) =>
    isActive
      ? `${styles.linkActive} ${styles.navigationItem}`
      : styles.navigationItem;

  return (
    <Fragment>
      {props.showMobileNav && <Backdrop onClick={props.onClick} />}

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
              <NavLink
                onClick={props.onClick}
                className={activeLinks}
                to="/main"
              >
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
                <p className={styles.link}>COMENZI ÎN LUCRU</p>
              </NavLink>
            </li>
            <li>
              <NavLink
                onClick={props.onClick}
                className={activeLinks}
                to="/clients"
              >
                <AddressBook size={32} className={styles.icon} />
                <p className={styles.link}>CLIENȚI</p>
              </NavLink>
            </li>
            <li>
              <NavLink
                onClick={props.onClick}
                className={activeLinks}
                to="/statements"
              >
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
              <NavLink
                onClick={props.onClick}
                className={activeLinks}
                to="/metrics"
              >
                <Activity size={32} className={styles.icon} />
                <p className={styles.link}>DATE DE LUCRU</p>
              </NavLink>
            </li>
          </ul>

          <ul className={styles.profileList}>
            <li>
              <NavLink
                onClick={props.onClick}
                className={styles.profileItem}
                to="/profile"
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
                <p className={styles.link}>SETĂRI</p>
              </NavLink>
            </li>
          </ul>
        </nav>
      </CSSTransition>
    </Fragment>
  );
};

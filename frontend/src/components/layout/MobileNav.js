import React, { Fragment, useContext } from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
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
import { useTranslation } from 'react-i18next';

import Backdrop from '../COMMON/UIElements/Backdrop';
import { AuthContext } from '../../context/auth-context';

import styles from './MobileNav.module.css';
import '../../index.css';

export const MobileNav = (props) => {
  const { theme } = useContext(AuthContext);

  const { t } = useTranslation();

  const activeLinks = ({ isActive }) =>
    isActive
      ? `${styles.linkActive} ${styles.navigationItem}`
      : styles.navigationItem;

  const content = (
    <Fragment>
      {props.showMobileNav && <Backdrop onClick={props.onClick} />}

      <CSSTransition
        classNames="slide-in-left"
        in={props.showMobileNav}
        timeout={200}
        mountOnEnter
        unmountOnExit
      >
        <nav
          className={`${styles.mobileNavigation} ${
            styles[`${theme}MobileNavigation`]
          }`}
        >
          <ul className={styles.mobileNavigationList}>
            <li>
              <NavLink
                onClick={props.onClick}
                className={activeLinks}
                to="/main"
              >
                <AppWindow size={32} className={styles.icon} />
                <p className={styles.link}>
                  {t('navigation.dashboard').toUpperCase()}
                </p>
              </NavLink>
            </li>
            <li>
              <NavLink
                onClick={props.onClick}
                className={activeLinks}
                to="/queue"
              >
                <Hourglass size={32} className={styles.icon} />
                <p className={styles.link}>
                  {t('navigation.pendingOrders').toUpperCase()}
                </p>
              </NavLink>
            </li>
            <li>
              <NavLink
                onClick={props.onClick}
                className={activeLinks}
                to="/clients"
              >
                <AddressBook size={32} className={styles.icon} />
                <p className={styles.link}>
                  {t('navigation.clients').toUpperCase()}
                </p>
              </NavLink>
            </li>
            <li>
              <NavLink
                onClick={props.onClick}
                className={activeLinks}
                to="/statements"
              >
                <BookOpen size={32} className={styles.icon} />
                <p className={styles.link}>
                  {t('navigation.clientStatements').toUpperCase()}
                </p>
              </NavLink>
            </li>
            <li>
              <NavLink
                onClick={props.onClick}
                className={activeLinks}
                to="/invoicing"
              >
                <Money size={32} className={styles.icon} />
                <p className={styles.link}>
                  {t('navigation.invoicing').toUpperCase()}
                </p>
              </NavLink>
            </li>
            <li>
              <NavLink
                onClick={props.onClick}
                className={activeLinks}
                to="/metrics"
              >
                <Activity size={32} className={styles.icon} />
                <p className={styles.link}>
                  {t('navigation.metrics').toUpperCase()}
                </p>
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
                <p className={styles.link}>
                  {t('navigation.profile').toUpperCase()}
                </p>
              </NavLink>
            </li>
          </ul>
        </nav>
      </CSSTransition>
    </Fragment>
  );

  return ReactDOM.createPortal(content, document.getElementById('root'));
};

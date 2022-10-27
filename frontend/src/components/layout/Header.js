import React, { useState, useEffect, useContext } from 'react';
import { SignOut, Gear } from 'phosphor-react';
import { useTranslation } from 'react-i18next';

import SettingsModal from '../COMMON/Modals/UserModals/SettingsModal';

import { MobileNav } from './MobileNav';
import { AuthContext } from '../../context/auth-context';

import styles from './Header.module.css';

export const Header = () => {
  const { logout, theme } = useContext(AuthContext);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [file, setFile] = useState();
  const [preview, setPreview] = useState();

  const { t } = useTranslation();

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreview(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  return (
    <header className={`${styles.header} ${styles[`${theme}Header`]}`}>
      <SettingsModal
        show={showSettings}
        preview={preview}
        setPreview={setPreview}
        setFile={setFile}
        setShowSettings={setShowSettings}
      />
      <div className={styles.headerName}>
        <button
          className={styles.navigationButton}
          onClick={() => setShowMobileNav(true)}
        >
          <span />
          <span />
          <span />
        </button>

        <h1 className={styles.zent}>
          ZenT<sup>freelance</sup>
        </h1>
      </div>

      <MobileNav
        showMobileNav={showMobileNav}
        onClick={() => setShowMobileNav(false)}
      />

      <div className={styles.userBar}>
        <div className={styles.userBarMenu}>
          <button
            className={styles.profileLink}
            onClick={() => setShowSettings(true)}
          >
            <Gear size={32} />
            <span>{t('header.settings')}</span>
          </button>
          <button className={styles.logoutBtn} onClick={logout}>
            <SignOut size={32} />
            <span>{t('header.logOut')}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

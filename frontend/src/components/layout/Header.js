import React, { useState, useContext } from 'react';
import { SignOut, User } from 'phosphor-react';

import { MobileNav } from './MobileNav';
import { AuthContext } from '../../context/auth-context';
import { useForm } from '../../hooks/useForm';
import Button from '../UIElements/Button';
import Input from '../UIElements/Input';

import styles from './Header.module.css';
import Modal from '../UIElements/Modal';

export const Header = () => {
  const { logout } = useContext(AuthContext);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const [formState, inputHandler] = useForm(
    { language: 'RO', theme: 'default' },
    true
  );

  const submitHandler = (e) => {
    e.preventDefault();
  };

  return (
    <header className={styles.header}>
      <Modal
        form
        show={showProfile}
        close={() => setShowProfile(false)}
        header="NUME UTILIZATOR"
        footer={`Profil modificat ultima dată la: ${new Date().toLocaleString()}`}
      >
        <div className={styles.profileAvatar}>
          <img src="./images/avatar.jpg" alt="" />
          <p>
            Alias: <span>NICKNAME</span>
          </p>
        </div>
        <div className={styles.profileSettings}>
          <Input
            className={styles.profileInput}
            id="language"
            element="select"
            label="Limba selectată"
            onInput={inputHandler}
            validators={[]}
          >
            <option value="RO">Română</option>
          </Input>
          <Input
            className={styles.profileInput}
            id="theme"
            element="select"
            label="Temă"
            onInput={inputHandler}
            validators={[]}
          >
            <option value="Implicit">Implicit</option>
          </Input>
        </div>
        <div className={styles.profileActions}>
          <Button type="submit" onClick={submitHandler}>
            Salvează
          </Button>
          <Button danger type="button" onClick={() => setShowProfile(false)}>
            Închide
          </Button>
        </div>
      </Modal>
      <div className={styles.headerName}>
        <button
          className={styles.navigationButton}
          onClick={() => setShowMobileNav(true)}
        >
          <span />
          <span />
          <span />
        </button>
        <h1>TRMS</h1>
      </div>

      <MobileNav
        showMobileNav={showMobileNav}
        onClick={() => setShowMobileNav(false)}
      />

      <div className={styles.userBar}>
        <div className={styles.userAvatar}>
          <img src="./images/avatar.jpg" alt="" />
        </div>
        <div className={styles.userName}>UTILIZATOR</div>
        <div className={styles.userBarMenu}>
          <button
            className={styles.profileLink}
            onClick={() => setShowProfile(true)}
          >
            <User size={32} />
            <span>setări</span>
          </button>
          <button className={styles.logoutBtn} onClick={logout}>
            <SignOut size={32} />
            <span>deconectare</span>
          </button>
        </div>
      </div>
    </header>
  );
};

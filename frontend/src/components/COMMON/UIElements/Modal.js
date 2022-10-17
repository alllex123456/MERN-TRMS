import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'phosphor-react';
import { CSSTransition } from 'react-transition-group';

import { AuthContext } from '../../../context/auth-context';

import Backdrop from './Backdrop';

import styles from './Modal.module.css';

const ModalOverlay = (props) => {
  const { theme } = useContext(AuthContext);
  const content = (
    <div
      className={`${styles.overlay} ${props.className} ${
        props.small && styles.small
      } ${props.medium && styles.medium} ${styles[`${theme}Overlay`]}`}
    >
      <header className={`${styles.header} ${props.className}`}>
        <div className={styles.title}>{props.header}</div>
        <div>
          <X size={32} className={styles.close} onClick={props.close} />
        </div>
      </header>
      {props.form && (
        <form
          className={`${styles.main} ${props.className}`}
          onSubmit={
            props.onSubmit ? props.onSubmit : (event) => event.preventDefault()
          }
          method={props.method}
          encType={
            props.enctype ? props.enctype : 'application/x-www-form-urlencoded'
          }
        >
          {props.children}
        </form>
      )}
      {props.card && props.children}
      <footer className={`${styles.footer} ${props.className}`}>
        {props.footer}
      </footer>
    </div>
  );
  return ReactDOM.createPortal(content, document.getElementById('modal'));
};

const Modal = (props) => {
  return (
    <React.Fragment>
      {props.show && <Backdrop onClick={props.close} />}
      <CSSTransition
        in={props.show}
        classNames="modal"
        timeout={200}
        mountOnEnter
        unmountOnExit
      >
        <ModalOverlay {...props} />
      </CSSTransition>
    </React.Fragment>
  );
};

export default Modal;

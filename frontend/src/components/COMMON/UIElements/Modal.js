import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import Backdrop from './Backdrop';

import styles from './Modal.module.css';

const ModalOverlay = (props) => {
  const content = (
    <div className={`${styles.overlay} ${props.className}`}>
      <header className={`${styles.header} ${props.className}`}>
        {props.header}
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

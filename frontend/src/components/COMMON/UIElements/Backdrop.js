import React from 'react';
import ReactDOM from 'react-dom';

import styles from './Backdrop.module.css';

const Backdrop = (props) => {
  return ReactDOM.createPortal(
    <div
      className={`${styles.backdrop} ${props.className}`}
      onClick={props.onClick}
    />,
    document.getElementById('backdrop')
  );
};

export default Backdrop;

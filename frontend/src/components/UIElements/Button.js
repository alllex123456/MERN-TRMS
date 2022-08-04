import React from 'react';
import { Link } from 'react-router-dom';

import styles from './Button.module.css';

const Button = (props) => {
  if (props.href) {
    return (
      <a
        className={`${props.className} ${styles.button} ${styles.button}--${
          props.size || 'medium'
        } ${props.inverse && styles.inverse} ${props.danger && styles.danger}`}
        href={props.href}
      >
        {props.children}{' '}
      </a>
    );
  }

  if (props.to) {
    return (
      <Link
        className={`${props.className} ${styles.button} ${styles.button}--${
          props.size || 'medium'
        } ${props.inverse && styles.inverse} ${props.danger && styles.danger}`}
        href={props.href}
        to={props.to}
      >
        {props.children}
      </Link>
    );
  }

  return (
    <button
      className={`${props.className} ${styles.button} ${styles.button}--${
        props.size || 'medium'
      } ${props.inverse && styles.inverse} ${props.danger && styles.danger}`}
      type={props.type}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export default Button;

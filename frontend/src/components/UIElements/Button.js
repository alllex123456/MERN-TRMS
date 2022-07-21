import React from 'react';
import { Link } from 'react-router-dom';

import styles from './Button.module.css';

const Button = (props) => {
  if (props.href) {
    return (
      <a
        className={`${styles.button} ${styles.button}--${
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
        className={`${styles.button} ${styles.button}--${
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
      className={`${styles.button} ${styles.button}--${
        props.size || 'medium'
      } ${props.inverse && styles.inverse} ${props.danger && styles.danger}`}
      href={props.href}
      type={props.type}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;

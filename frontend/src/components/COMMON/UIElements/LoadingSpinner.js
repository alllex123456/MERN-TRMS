import React from 'react';

import styles from './LoadingSpinner.module.css';

const LoadingSpinner = (props) => {
  return (
    <div className={`${props.className} ${props.asOverlay && styles.overlay}`}>
      <div className={styles.loadingSpinner} />
    </div>
  );
};

export default LoadingSpinner;

import React from 'react';
import Modal from '../../UIElements/Modal';
import Button from '../../UIElements/Button';

import styles from './ErrorModal.module.css';

const ErrorModal = (props) => {
  return (
    <Modal
      card
      className={styles.errorModal}
      show={!!props.error}
      header="Eroare"
      footer={<Button onClick={props.onClear}>Închide</Button>}
      close={props.onClear}
    >
      <p className={styles.error}>{props.error}</p>
    </Modal>
  );
};

export default ErrorModal;

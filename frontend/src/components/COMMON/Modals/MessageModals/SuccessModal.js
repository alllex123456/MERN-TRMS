import React from 'react';
import Modal from '../../UIElements/Modal';
import Button from '../../UIElements/Button';

import styles from './SuccessModal.module.css';

const SuccessModal = (props) => {
  return (
    <Modal
      className={styles.successModal}
      card
      show={!!props.success}
      header="Succes"
      footer={<Button onClick={props.onClear}>Închide</Button>}
      close={props.onClear}
    >
      <p className={styles.success}>{props.success}</p>
    </Modal>
  );
};

export default SuccessModal;

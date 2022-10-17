import React from 'react';
import Modal from '../../UIElements/Modal';
import Button from '../../UIElements/Button';

import styles from './SuccessModal.module.css';

const SuccessModal = (props) => {
  return (
    <Modal
      small
      className={styles.successModal}
      card
      show={!!props.success}
      header="Succes"
      footer={
        <Button primary onClick={props.onClear}>
          OK
        </Button>
      }
      close={props.onClear}
    >
      <p className={styles.success}>{props.success}</p>
    </Modal>
  );
};

export default SuccessModal;

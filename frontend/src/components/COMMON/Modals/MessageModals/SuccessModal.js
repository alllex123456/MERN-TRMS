import React from 'react';
import { useTranslation } from 'react-i18next';

import Modal from '../../UIElements/Modal';
import Button from '../../UIElements/Button';

import styles from './SuccessModal.module.css';

const SuccessModal = (props) => {
  const { t } = useTranslation();
  return (
    <Modal
      small
      className={styles.successModal}
      card
      show={!!props.success}
      header={t('modals.successHeader')}
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

import React from 'react';
import { useTranslation } from 'react-i18next';

import Modal from '../../UIElements/Modal';
import Button from '../../UIElements/Button';

import styles from './ErrorModal.module.css';

const ErrorModal = (props) => {
  const { t } = useTranslation();
  return (
    <Modal small
      card
      className={styles.errorModal}
      show={!!props.error}
      header={t('modals.errorHeader')}
      footer={
        <Button primary onClick={props.onClear}>
          Închide
        </Button>
      }
      close={props.onClear}
    >
      <p className={styles.error}>{props.error}</p>
    </Modal>
  );
};

export default ErrorModal;

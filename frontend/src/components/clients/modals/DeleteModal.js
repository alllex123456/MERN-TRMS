import React from 'react';

import Button from '../../UIElements/Button';

import Modal from '../../UIElements/Modal';

import styles from './modals.module.css';

const DeleteModal = (props) => {
  const deleteHandler = (event) => {
    event.preventDefault();
    console.log('deleted');
  };
  const header = `Șterge client: ${props.clientData.name}`;

  return (
    <Modal
      card
      header={header}
      show={props.show}
      close={props.onCloseModal}
      onSubmit={deleteHandler}
    >
      <h2 className="center">Sigur dorești să ștergi acest client?</h2>
      <div className={styles.formActions}>
        <Button type="submit">ȘTERGE</Button>
        <Button type="button" danger onClick={props.onCloseModal}>
          ANULEAZĂ
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteModal;

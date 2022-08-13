import React from 'react';
import Button from '../../UIElements/Button';

import Modal from '../../UIElements/Modal';

import styles from './modals.module.css';

const ViewModal = (props) => {
  const header = `Date client ${props.clientData.name}`;
  const footer = `Ultima modificare la: ${new Date().toLocaleString()}`;
  const mailto = `mailto:${props.clientData.email}`;

  return (
    <Modal
      card
      header={header}
      footer={footer}
      show={props.show}
      close={props.onCloseModal}
    >
      <div className={styles.section}>
        <span>Numele clientului:</span> <h2>{props.clientData.name}</h2>
        <span>
          Adresa de email: <a href={mailto}> ${props.clientData.email}</a>
        </span>
        <span>Telefon: ${props.clientData.phone}</span>
      </div>
      <div className={styles.section}>
        <span>Tarif: {props.clientData.rate}</span>
        <span>Unitate de măsură: {props.clientData.unit}</span>
      </div>
      <div className={styles.section}>
        <span>Sediul: {props.clientData.registeredOffice}</span>
        <span>Nr. de înregistrare: {props.clientData.registrationNumber}</span>
        <span>Cod fiscal: {props.clientData.taxNumber}</span>
        <span>Banca: {props.clientData.bank}</span>
        <span>Banca: {props.clientData.iban}</span>
      </div>
      <div className={styles.section}>
        <span>Note: {props.clientData.notes}</span>
        <span>Data adăugării: {props.clientData.dateAdded}</span>
      </div>
      <div className={styles.actions}>
        <Button type="button" onClick={() => props.onCloseModal()}>
          Închide
        </Button>
      </div>
    </Modal>
  );
};

export default ViewModal;

import React from 'react';

import { VALIDATOR_REQUIRE } from '../../../utilities/form-validator';

import Button from '../../UIElements/Button';
import Input from '../../UIElements/Input';
import Modal from '../../UIElements/Modal';
import { useForm } from '../../../hooks/useForm';

import styles from './modals.module.css';

const EditModal = (props) => {
  const [formState, inputHandler] = useForm(
    {
      editReference: { value: props.clientData.clientRef || '', isValid: true },
      editName: { value: props.clientData.name || '', isValid: true },
      editEmail: { value: props.clientData.email || '', isValid: true },
      editPhone: { value: props.clientData.phone || '', isValid: true },
      editRate: { value: props.clientData.rate || '', isValid: true },
      editUnit: { value: props.clientData.unit || '', isValid: true },
      editRegisteredOffice: {
        value: props.clientData.registeredOffice || '',
        isValid: true,
      },
      editRegistrationNumber: {
        value: props.clientData.registrationNumber || '',
        isValid: true,
      },
      editTaxNumber: { value: props.clientData.taxNumber || '', isValid: true },
      editBank: { value: props.clientData.bank || '', isValid: true },
      editIban: { value: props.clientData.iban || '', isValid: true },
    },
    true
  );

  const editHandler = (event) => {
    event.preventDefault();
    console.log('edited');
  };

  const header = `Editează client: ${props.clientData.name}`;

  return (
    <Modal
      form
      header={header}
      show={props.show}
      close={props.onCloseModal}
      onSubmit={editHandler}
    >
      <div className={styles.formGroup}>
        <label htmlFor="editName">Nume:</label>
        <Input
          className={styles.input}
          element="input"
          id="editName"
          defaultValue={props.clientData.name}
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Nu a fost specificat un nume"
          onInput={inputHandler}
        />
      </div>
      <div className={`${styles.formGroup} ${styles.flex}`}>
        <section>
          <label htmlFor="editEmail">Email:</label>
          <Input
            className={styles.input}
            element="input"
            id="editEmail"
            type="email"
            defaultValue={props.clientData.email}
            onInput={inputHandler}
          />
        </section>
        <section>
          <label htmlFor="editRegisteredOffice">Telefon:</label>
          <Input
            className={styles.input}
            element="input"
            id="editRegisteredOffice"
            type="phone"
            defaultValue={props.clientData.phone}
            validators={[]}
            onInput={inputHandler}
          />
        </section>
      </div>
      <div className={`${styles.formGroup} ${styles.flex}`}>
        <section>
          <label htmlFor="editRate">Tarif:</label>
          <Input
            className={styles.input}
            element="input"
            id="editRate"
            type="number"
            step="0.01"
            defaultValue={props.clientData.rate}
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Nu a fost specificat un tarif"
            onInput={inputHandler}
          />
        </section>
        <section>
          <label htmlFor="editCurrency">Moneda:</label>
          <Input
            className={styles.input}
            element="select"
            id="editCurrency"
            defaultValue={props.clientData.currency}
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Nu a fost selectă moneda"
            onInput={inputHandler}
          >
            <option value={props.clientData.currency}>
              {props.clientData.currency}
            </option>
          </Input>
        </section>
        <section>
          <label htmlFor="editUnit">Unitate de tarifare:</label>
          <Input
            className={styles.input}
            element="select"
            id="editUnit"
            defaultValue={props.clientData.unit}
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Nu a fost selectată o unitate de tarifare"
            onInput={inputHandler}
          >
            <option value={props.clientData.unit}>
              {props.clientData.unit}
            </option>
          </Input>
        </section>
      </div>
      <div className={`${styles.formGroup} ${styles.flex}`}>
        <section>
          <label htmlFor="editRegisteredOffice">Sediul:</label>
          <Input
            className={styles.input}
            element="input"
            id="editRegisteredOffice"
            type="text"
            defaultValue={props.clientData.registeredOffice}
            validators={[]}
            onInput={inputHandler}
          />
        </section>

        <section>
          <label htmlFor="editRegistrationNumber">Nr. de înregistrare:</label>
          <Input
            className={styles.input}
            element="input"
            id="editRegistrationNumber"
            type="text"
            defaultValue={props.clientData.registrationNumber}
            validators={[]}
            onInput={inputHandler}
          />
        </section>

        <section>
          <label htmlFor="editTaxNumber">Cod fiscal:</label>
          <Input
            className={styles.input}
            element="input"
            id="editTaxNumber"
            type="text"
            defaultValue={props.clientData.taxNumber}
            validators={[]}
            onInput={inputHandler}
          />
        </section>
      </div>
      <div className={`${styles.formGroup} ${styles.flex}`}>
        <section>
          <label htmlFor="editBank">Banca:</label>
          <Input
            className={styles.input}
            element="input"
            id="editBank"
            type="text"
            defaultValue={props.clientData.bank}
            validators={[]}
            onInput={inputHandler}
          />
        </section>

        <section>
          <label htmlFor="editIban">IBAN:</label>
          <Input
            className={styles.input}
            element="input"
            id="editIban"
            type="text"
            defaultValue={props.clientData.iban}
            validators={[]}
            onInput={inputHandler}
          />
        </section>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="editNotes">Note:</label>
        <Input
          className={styles.textarea}
          element="textarea"
          id="editNotes"
          defaultValue={props.clientData.notes}
          validators={[]}
          onInput={inputHandler}
        />
      </div>

      <div className={styles.formActions}>
        <Button type="submit" disabled={!formState.isValid}>
          SALVEAZĂ
        </Button>
        <Button type="button" danger onClick={props.onCloseModal}>
          ANULEAZĂ
        </Button>
      </div>
    </Modal>
  );
};

export default EditModal;

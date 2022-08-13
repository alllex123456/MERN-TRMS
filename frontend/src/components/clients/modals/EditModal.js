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
      editCurrency: { value: props.clientData.currency || '', isValid: true },
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
      editNotes: { value: props.clientData.notes || '', isValid: true },
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
        <Input
          className={styles.input}
          label="Numele:"
          element="input"
          id="editName"
          defaultValue={props.clientData.name}
          defaultValidity={formState.inputs.editName.isValid}
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Nu a fost specificat un nume"
          onInput={inputHandler}
        />
      </div>
      <div className={`${styles.formGroup} ${styles.flex}`}>
        <Input
          className={styles.input}
          label="Email:"
          element="input"
          id="editEmail"
          type="email"
          defaultValue={props.clientData.email}
          defaultValidity={formState.inputs.editEmail.isValid}
          onInput={inputHandler}
        />

        <Input
          className={styles.input}
          label="Telefon:"
          element="input"
          id="editPhone"
          type="phone"
          defaultValue={props.clientData.phone}
          defaultValidity={formState.inputs.editPhone.isValid}
          validators={[]}
          onInput={inputHandler}
        />
      </div>
      <div className={`${styles.formGroup} ${styles.flex}`}>
        <Input
          className={styles.input}
          label="Tarif"
          element="input"
          id="editRate"
          type="number"
          step="0.01"
          defaultValue={props.clientData.rate}
          defaultValidity={formState.inputs.editRate.isValid}
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Nu a fost specificat un tarif"
          onInput={inputHandler}
        />

        <Input
          className={styles.input}
          label="Monedă:"
          element="select"
          id="editCurrency"
          defaultValue={props.clientData.currency}
          defaultValidity={formState.inputs.editCurrency.isValid}
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Nu a fost selectă moneda"
          onInput={inputHandler}
        >
          <option value={props.clientData.currency}>
            {props.clientData.currency}
          </option>
        </Input>

        <Input
          className={styles.input}
          label="Unitate:"
          element="select"
          id="editUnit"
          defaultValue={props.clientData.unit}
          defaultValidity={formState.inputs.editUnit.isValid}
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Nu a fost selectată o unitate de tarifare"
          onInput={inputHandler}
        >
          <option value={props.clientData.unit}>{props.clientData.unit}</option>
        </Input>
      </div>
      <div className={`${styles.formGroup} ${styles.flex}`}>
        <Input
          className={styles.input}
          label="Sediul:"
          element="input"
          id="editRegisteredOffice"
          type="text"
          defaultValue={props.clientData.registeredOffice}
          defaultValidity={formState.inputs.editRegisteredOffice.isValid}
          validators={[]}
          onInput={inputHandler}
        />

        <Input
          className={styles.input}
          label="Nr. de înregistrare:"
          element="input"
          id="editRegistrationNumber"
          type="text"
          defaultValue={props.clientData.registrationNumber}
          defaultValidity={formState.inputs.editRegistrationNumber.isValid}
          validators={[]}
          onInput={inputHandler}
        />

        <Input
          className={styles.input}
          label="Cod fiscal:"
          element="input"
          id="editTaxNumber"
          type="text"
          defaultValue={props.clientData.taxNumber}
          defaultValidity={formState.inputs.editTaxNumber.isValid}
          validators={[]}
          onInput={inputHandler}
        />
      </div>
      <div className={`${styles.formGroup} ${styles.flex}`}>
        <Input
          className={styles.input}
          label="Banca:"
          element="input"
          id="editBank"
          type="text"
          defaultValue={props.clientData.bank}
          defaultValidity={formState.inputs.editBank.isValid}
          validators={[]}
          onInput={inputHandler}
        />

        <Input
          className={styles.input}
          label="IBAN:"
          element="input"
          id="editIban"
          type="text"
          defaultValue={props.clientData.iban}
          defaultValidity={formState.inputs.editIban.isValid}
          validators={[]}
          onInput={inputHandler}
        />
      </div>
      <div className={styles.formGroup}>
        <Input
          className={styles.textarea}
          label="Note:"
          element="textarea"
          id="editNotes"
          defaultValue={props.clientData.notes}
          defaultValidity={formState.inputs.editNotes.isValid}
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

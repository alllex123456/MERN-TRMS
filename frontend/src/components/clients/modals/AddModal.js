import React from 'react';

import { VALIDATOR_REQUIRE } from '../../../utilities/form-validator';

import Button from '../../UIElements/Button';
import Input from '../../UIElements/Input';
import Modal from '../../UIElements/Modal';
import { useForm } from '../../../hooks/useForm';

import styles from './modals.module.css';

const AddModal = (props) => {
  const [formState, inputHandler] = useForm(
    {
      name: { value: '', isValid: false },
      rate: { value: '', isValid: false },
      currency: { value: '', isValid: false },
      unit: { value: '', isValid: false },
      registeredOffice: { value: '', isValid: true },
      registrationNumber: { value: '', isValid: true },
      taxNumber: { value: '', isValid: true },
      bank: { value: '', isValid: true },
      iban: { value: '', isValid: true },
      email: { value: '', isValid: true },
      phone: { value: '', isValid: true },
      notes: { value: '', isValid: true },
      dateAdded: { value: '', isValid: true },
    },
    false
  );

  console.log(formState.inputs);

  const editHandler = (event) => {
    event.preventDefault();
    console.log('edited');
  };

  const header = `Adaugă client nou`;

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
          label="Nume:"
          element="input"
          id="name"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Nu a fost introdus un nume"
          onInput={inputHandler}
        />
      </div>
      <div className={`${styles.formGroup} ${styles.flex}`}>
        <Input
          className={styles.input}
          label="Tarif:"
          element="input"
          id="rate"
          type="number"
          step="0.01"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Nu a fost introdus un tarif"
          onInput={inputHandler}
        />
        <Input
          className={styles.input}
          label="Moneda:"
          element="select"
          id="currency"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Nu a fost selectată moneda"
          defaultValidity={formState.inputs.currency.isValid}
          onInput={inputHandler}
        >
          <option>selectează moneda...</option>
          <option value="RON">RON</option>
        </Input>
        <Input
          className={styles.input}
          label="Unitatea de măsură:"
          element="select"
          id="unit"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Nu a fost selectată unitatea de măsură"
          defaultValidity={formState.inputs.unit.isValid}
          onInput={inputHandler}
        >
          <option>selectează unitatea...</option>
          <option value="2000ccs">2.000 caractere cu spații</option>
        </Input>
      </div>
      <div className={`${styles.formGroup} ${styles.flex}`}>
        <Input
          className={styles.input}
          label="Email:"
          element="input"
          id="email"
          type="email"
          validators={[]}
          defaultValidity={formState.inputs.email.isValid}
          onInput={inputHandler}
        />
        <Input
          className={styles.input}
          label="Telefon:"
          element="input"
          id="phone"
          type="phone"
          validators={[]}
          onInput={inputHandler}
        />
      </div>
      <div className={`${styles.formGroup} ${styles.flex}`}>
        <Input
          className={styles.input}
          label="Sediul:"
          element="input"
          id="registeredOffice"
          type="text"
          validators={[]}
          defaultValidity={formState.inputs.registeredOffice.isValid}
          onInput={inputHandler}
        />
        <Input
          className={styles.input}
          label="Nr. de înregistrare:"
          element="input"
          id="registrationNumber"
          type="text"
          validators={[]}
          defaultValidity={formState.inputs.registrationNumber.isValid}
          onInput={inputHandler}
        />
      </div>
      <div className={`${styles.formGroup} ${styles.flex}`}>
        <Input
          className={styles.input}
          label="Cod fiscal:"
          element="input"
          id="taxNumber"
          type="text"
          validators={[]}
          defaultValidity={formState.inputs.taxNumber.isValid}
          onInput={inputHandler}
        />
        <Input
          className={styles.input}
          label="Banca:"
          element="input"
          id="bank"
          type="text"
          validators={[]}
          defaultValidity={formState.inputs.bank.isValid}
          onInput={inputHandler}
        />
        <Input
          className={styles.input}
          label="IBAN:"
          element="input"
          id="iban"
          type="text"
          validators={[]}
          defaultValidity={formState.inputs.iban.isValid}
          onInput={inputHandler}
        />
      </div>
      <div className={styles.formGroup}>
        <Input
          className={styles.input}
          label="Note:"
          element="textarea"
          id="notes"
          validators={[]}
          defaultValidity={formState.inputs.notes.isValid}
          onInput={inputHandler}
        />
      </div>
      <div className={styles.formGroup}>
        <Input
          className={styles.input}
          label="Adăugat la:"
          element="input"
          type="datetime"
          id="dateAdded"
          defaultValue={new Date().toLocaleString()}
          defaultValidity={formState.inputs.dateAdded.isValid}
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

export default AddModal;

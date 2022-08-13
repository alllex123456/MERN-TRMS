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
      editReference: { value: '', isValid: true },
      editClient: { value: '', isValid: false },
      editReceived: { value: '', isValid: true },
      editDeadline: { value: '', isValid: false },
      editRate: { value: '', isValid: false },
      editCount: { value: '', isValid: false },
      editNotes: { value: '', isValid: true },
    },
    false
  );

  const editHandler = (event) => {
    event.preventDefault();
    console.log('edited');
  };

  const header = `Adaugă comandă nouă`;

  return (
    <Modal
      form
      header={header}
      show={props.show}
      close={props.onCloseModal}
      onSubmit={editHandler}
    >
      <div className={styles.formGroup}>
        <label htmlFor="editClient">Client:</label>
        <Input
          className={styles.input}
          element="select"
          id="editClient"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Nu a fost selectat un client"
          defaultValidity={formState.inputs.editClient.isValid}
          onInput={inputHandler}
        >
          <option>selectează clientul...</option>
          <option VALUE="CLIENT">CLIENT</option>
        </Input>
      </div>
      <div className={`${styles.formGroup} ${styles.flex}`}>
        <section>
          <label htmlFor="editReceived">Data primirii:</label>
          <Input
            className={styles.input}
            element="input"
            id="editReceived"
            type="datetime"
            defaultValue={new Date().toLocaleString().slice(0, 17)}
            defaultValidity={formState.inputs.editReceived.isValid}
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Nu a fost selectată data primirii"
            onInput={inputHandler}
          />
        </section>

        <section>
          <label htmlFor="editDeadline">Termen:</label>
          <Input
            className={styles.input}
            element="input"
            id="editDeadline"
            type="datetime"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Nu a fost selectat termenul de predare"
            defaultValidity={formState.inputs.editDeadline.isValid}
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
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Nu a fost selectat un tarif"
            defaultValidity={formState.inputs.editRate.isValid}
            onInput={inputHandler}
          />
        </section>

        <section>
          <label htmlFor="editCount">Volum estimat:</label>
          <Input
            className={styles.input}
            element="input"
            id="editCount"
            type="number"
            step="0.01"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Nu a fost selectat volumul estimat"
            defaultValidity={formState.inputs.editCount.isValid}
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
          validators={[]}
          defaultValidity={formState.inputs.editNotes.isValid}
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

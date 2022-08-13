import React from 'react';

import { VALIDATOR_REQUIRE } from '../../../utilities/form-validator';

import Button from '../../UIElements/Button';
import Input from '../../UIElements/Input';
import Modal from '../../UIElements/Modal';
import { useForm } from '../../../hooks/useForm';

import styles from './modals.module.css';

const CompleteModal = (props) => {
  const [formState, inputHandler] = useForm(
    {
      editReference: { value: props.orderData.orderRef || '', isValid: true },
      editClient: { value: props.orderData.client || '', isValid: true },
      editReceived: { value: props.orderData.received || '', isValid: true },
      editDeadline: { value: props.orderData.deadline || '', isValid: true },
      editRate: { value: props.orderData.rate || '', isValid: true },
      editCount: { value: props.orderData.count || '', isValid: true },
      editNotes: { value: props.orderData.notes || '', isValid: true },
    },
    true
  );

  const editHandler = (event) => {
    event.preventDefault();
    console.log('completed');
  };

  const header = `Finalizează comanda pentru ${props.orderData.client}`;

  return (
    <Modal
      form
      header={header}
      show={props.show}
      close={props.onCloseModal}
      onSubmit={editHandler}
    >
      <div className={styles.modalGroup}>
        <h2>Client:</h2>
        <p>{props.orderData.client}</p>
      </div>
      <div className={`${styles.modalGroup} ${styles.flex}`}>
        <section>
          <h2>Data primirii:</h2>
          <p>{props.orderData.received}</p>
        </section>
        <section>
          <h2>Termen:</h2>
          <p>{props.orderData.deadline}</p>
        </section>
      </div>
      <div className={`${styles.modalGroup} ${styles.flex}`}>
        <section>
          <h2>Tarif:</h2>
          <p>{props.orderData.rate}</p>
        </section>

        <section>
          <Input
            className={styles.input}
            label="Volum final"
            element="input"
            id="editCount"
            type="number"
            step="0.01"
            defaultValue={formState.inputs.editCount.value}
            defaultValidity={formState.inputs.editCount.isValid}
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Nu a fost selectat volumul final"
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
          defaultValue={formState.inputs.editNotes.value}
          defaultValidity={formState.inputs.editNotes.isValid}
          validators={[]}
          onInput={inputHandler}
        />
      </div>

      <div className={styles.formActions}>
        <Button type="submit" disabled={!formState.isValid}>
          FINALIZEAZĂ
        </Button>
        <Button type="button" danger onClick={props.onCloseModal}>
          ANULEAZĂ
        </Button>
      </div>
    </Modal>
  );
};

export default CompleteModal;

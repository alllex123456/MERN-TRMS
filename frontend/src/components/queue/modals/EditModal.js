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
    console.log('edited');
  };

  const header = `Editeaza comanda pentru ${props.orderData.client}`;

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
          defaultValue={formState.inputs.editClient.value}
          defaultValidity={formState.inputs.editClient.isValid}
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Nu a fost selectat un client"
          onInput={inputHandler}
        >
          <option defaultValue={props.orderData.client}>
            {props.orderData.client}
          </option>
          <option>CLIENT</option>
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
            defaultValue={formState.inputs.editReceived.value}
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
            defaultValue={formState.inputs.editDeadline.value}
            defaultValidity={formState.inputs.editDeadline.isValid}
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Nu a fost selectat termenul de predare"
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
            defaultValue={formState.inputs.editRate.value}
            defaultValidity={formState.inputs.editRate.isValid}
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Nu a fost selectat un tarif"
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

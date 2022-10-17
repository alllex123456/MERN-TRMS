import React, { useState, useEffect, useContext } from 'react';
import ErrorModal from '../MessageModals/ErrorModal';
import SuccessModal from '../MessageModals/SuccessModal';
import Modal from '../../UIElements/Modal';
import Input from '../../FormElements/Input';
import Button from '../../UIElements/Button';
import LoadingSpinner from '../../UIElements/LoadingSpinner';

import { useHttpClient } from '../../../../hooks/useHttpClient';
import { useForm } from '../../../../hooks/useForm';
import { AuthContext } from '../../../../context/auth-context';

import '../../CSS/modals-form.css';
import '../../CSS/modals-layout.css';
import '../../CSS/table.css';
import { VALIDATOR_REQUIRE } from '../../../../utilities/form-validator';

const CashInvoice = (props) => {
  const { token } = useContext(AuthContext);

  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const [formState, inputHandler] = useForm(
    {
      cashedAmount: { value: '', isValid: false },
      receipt: { value: '', isValid: false },
      dateCashed: { value: '', isValid: false },
    },
    false
  );

  const { sendRequest, error, clearError, isLoading } = useHttpClient();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const responseData = await sendRequest(
        'http://localhost:8000/invoicing/cash-invoice',
        'PATCH',
        JSON.stringify({
          invoiceId: props.invoiceData.invoice.id,
          cashedAmount: formState.inputs.cashedAmount.value,
          receipt: formState.inputs.receipt.value,
          dateCashed: new Date(formState.inputs.dateCashed.value).toISOString(),
        }),
        { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }
      );
      setSuccessMessage(responseData.message);
      props.onUpdate();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };
  const closeModalHandler = () => {
    props.onCloseModal();
  };

  const clearSuccessMessage = () => {
    closeModalHandler();
    setSuccessMessage(null);
  };

  return (
    <React.Fragment>
      <ErrorModal show={error} onClear={clearError} />
      <SuccessModal success={successMessage} onClear={clearSuccessMessage} />
      <Modal
        small
        form
        show={props.show}
        close={closeModalHandler}
        header="Incaseaza factura"
        onSubmit={submitHandler}
      >
        {isLoading && <LoadingSpinner asOverlay />}
        {!successMessage && !isLoading && (
          <div className="cashInvoice">
            <header>
              <p className="modalTitle">
                Factura {props.invoiceData.invoice.series} /{' '}
                {props.invoiceData.invoice.number} <span>emisa catre</span>{' '}
                {props.invoiceData.client.name}
              </p>
            </header>
            <div className="formGroup flexColumn">
              <Input
                className="input"
                id="cashedAmount"
                element="input"
                label="Valoarea incasata*"
                validators={[VALIDATOR_REQUIRE()]}
                defaultValue={props.invoiceData.invoice.totalInvoice.toFixed(
                  props.invoiceData.client.decimalPoints
                )}
                defaultValidity={true}
                errorText="Nu ati introdus valoarea incasata"
                onInput={inputHandler}
              />
              <Input
                className="input"
                id="receipt"
                element="input"
                label="Cu document tip/numar*"
                validators={[VALIDATOR_REQUIRE()]}
                defaultValidity={formState.inputs.receipt.isValid}
                errorText="Nu ati introdus documentul de plata"
                onInput={inputHandler}
              />
              <Input
                className="input"
                id="dateCashed"
                element="input"
                type="date"
                label="La data*"
                validators={[VALIDATOR_REQUIRE()]}
                defaultValue={new Date().toISOString().slice(0, 10)}
                defaultValidity={true}
                errorText="Nu ati selectat data incasarii"
                onInput={inputHandler}
              />
            </div>
            <div className="formActions">
              <Button primary type="submit" disabled={!formState.isValid}>
                INCASEAZA
              </Button>
            </div>
            <p className="center error">{errorMessage}</p>
          </div>
        )}
      </Modal>
    </React.Fragment>
  );
};

export default CashInvoice;

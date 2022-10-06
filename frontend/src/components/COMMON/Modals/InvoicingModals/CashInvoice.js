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
  const { token, language } = useContext(AuthContext);

  const [successMessage, setSuccessMessage] = useState();

  const [formState, inputHandler] = useForm(
    {
      cashedAmount: { value: '', isValid: false },
    },
    false
  );

  const { sendRequest, error, clearError, isLoading } = useHttpClient();

  useEffect(() => {}, []);

  const submitHandler = async (e) => {
    e.preventDefault();
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
        form
        show={props.show}
        close={closeModalHandler}
        header="Incaseaza factura"
        onSubmit={submitHandler}
      >
        {isLoading && <LoadingSpinner asOverlay />}
        {!successMessage && !isLoading && (
          <React.Fragment>
            <header>
              <p className="modalTitle">
                Factura {props.invoiceData.invoice.series} /{' '}
                {props.invoiceData.invoice.number} <span>emisa catre</span>{' '}
                {props.invoiceData.client.name}
              </p>
            </header>
            <div className="formGroup flex">
              <Input
                className="input"
                id="cashedAmount"
                element="input"
                label="Valoarea incasata"
                validators={[VALIDATOR_REQUIRE]}
                defaultValue={props.invoiceData.invoice.totalInvoice}
                defaultValidity={true}
                onInput={inputHandler}
              />
              <Input
                className="input"
                id="receipt"
                element="input"
                label="Cu document tip/numar"
                validators={[VALIDATOR_REQUIRE]}
                onInput={inputHandler}
              />
            </div>
          </React.Fragment>
        )}
      </Modal>
    </React.Fragment>
  );
};

export default CashInvoice;

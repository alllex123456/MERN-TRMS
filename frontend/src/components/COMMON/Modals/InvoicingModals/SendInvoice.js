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
import {
  VALIDATOR_EMAIL,
  VALIDATOR_REQUIRE,
} from '../../../../utilities/form-validator';

const SendInvoice = (props) => {
  const { token } = useContext(AuthContext);
  const { sendRequest, error, clearError, isLoading } = useHttpClient();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [successMessage, setSuccessMessage] = useState();

  const [formState, inputHandler, setFormData] = useForm(
    {
      invoiceSeries: { value: '', isValid: false },
      invoiceNumber: { value: '', isValid: false },
      clientName: { value: '', isValid: false },
      clientEmail: { value: '', isValid: false },
      message: { value: '', isValid: false },
    },
    false
  );
  const { series, number } = props.invoiceData.invoice;
  const { name, email } = props.invoiceData.client;

  useEffect(() => {
    const getUserData = async () => {
      try {
        const responseData = await sendRequest(
          'http://localhost:8000/user',
          'GET',
          null,
          { Authorization: 'Bearer ' + token }
        );

        setFormData(
          {
            invoiceSeries: {
              value: series,
              isValid: true,
            },
            invoiceNumber: {
              value: number,
              isValid: true,
            },
            clientName: { value: name, isValid: true },
            clientEmail: {
              value: email,
              isValid: true,
            },
            message: {
              value: responseData.message.invoiceTemplate,
              isValid: true,
            },
          },
          true
        );
        setDataLoaded(true);
      } catch (error) {}
    };
    getUserData();
  }, [sendRequest, token, setFormData, email, name, series, number]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await sendRequest(
        `http://localhost:8000/invoicing/pdf/${props.invoiceData.invoice._id}`,
        'GET',
        null,
        { Authorization: 'Bearer ' + token }
      );
    } catch (error) {}

    try {
      const responseData = await sendRequest(
        'http://localhost:8000/invoicing/send-invoice',
        'POST',
        JSON.stringify({
          invoiceId: props.invoiceData.invoice._id,
          clientId: props.invoiceData.client._id,
          email: formState.inputs.clientEmail.value,
          message: formState.inputs.message.value,
        }),
        { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }
      );
      setSuccessMessage(responseData.message);
    } catch (error) {}
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
        method="POST"
        show={props.show}
        close={closeModalHandler}
        header="Trimite factura"
        onSubmit={submitHandler}
      >
        {isLoading && <LoadingSpinner asOverlay />}
        {!successMessage && dataLoaded && (
          <React.Fragment>
            {' '}
            <div className="formGroup flex">
              <Input
                disabled
                className="input"
                id="clientName"
                element="input"
                label="Client"
                validators={[VALIDATOR_REQUIRE]}
                defaultValue={formState.inputs.clientName.value}
                defaultValidity={formState.inputs.clientName.isValid}
                onInput={inputHandler}
              />
              <Input
                className="input"
                id="clientEmail"
                element="input"
                label="E-mail"
                validators={[VALIDATOR_EMAIL]}
                defaultValue={formState.inputs.clientEmail.value}
                defaultValidity={formState.inputs.clientEmail.validity}
                errorText="Nu ati introdus o adresa de email valida"
                onInput={inputHandler}
              />
              <Input
                disabled
                className="input"
                id="invoiceSeries"
                element="input"
                label="Seria"
                validators={[VALIDATOR_REQUIRE]}
                defaultValue={formState.inputs.invoiceSeries.value}
                defaultValidity={formState.inputs.invoiceSeries.isValid}
                onInput={inputHandler}
              />
              <Input
                disabled
                className="input"
                id="invoiceNumber"
                element="input"
                label="Numarul"
                validators={[VALIDATOR_REQUIRE]}
                defaultValue={formState.inputs.invoiceNumber.value}
                defaultValidity={formState.inputs.invoiceNumber.isValid}
                onInput={inputHandler}
              />
            </div>
            <div className="formGroup">
              <Input
                className="textarea"
                id="message"
                element="textarea"
                label="Corpul mesajului"
                validators={[]}
                defaultValue={formState.inputs.message.value}
                defaultValidity={formState.inputs.message.isValid}
                onInput={inputHandler}
              />
            </div>
            <div className="formActions">
              <Button type="submit" disabled={!formState.isValid}>
                TRIMITE
              </Button>
              <Button danger type="button" onClick={closeModalHandler}>
                INCHIDE
              </Button>
            </div>
          </React.Fragment>
        )}
      </Modal>
    </React.Fragment>
  );
};

export default SendInvoice;

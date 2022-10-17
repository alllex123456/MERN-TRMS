import React, { useState, useEffect, useContext } from 'react';

import Modal from '../../UIElements/Modal';
import Button from '../../UIElements/Button';
import Input from '../../FormElements/Input';
import ErrorModal from '../MessageModals/ErrorModal';
import LoadingSpinner from '../../UIElements/LoadingSpinner';
import SuccessModal from '../MessageModals/SuccessModal';

import { useForm } from '../../../../hooks/useForm';
import { useHttpClient } from '../../../../hooks/useHttpClient';
import { AuthContext } from '../../../../context/auth-context';

import '../../CSS/modals-form.css';
import '../../CSS/modals-layout.css';

const UpdateInvoicingData = (props) => {
  const { token } = useContext(AuthContext);
  const [successMessage, setSuccessMessage] = useState();

  const [formState, inputHandler, setFormData] = useForm(
    {
      invoiceSeries: { value: '', isValid: true },
      invoiceStartNumber: { value: '', isValid: true },
      bank: { value: '', isValid: true },
      iban: { value: '', isValid: true },
      invoiceTemplate: { value: '', isValid: true },
      invoiceNotes: { value: '', isValid: true },
    },
    true
  );

  const { sendRequest, isLoading, error, clearError } = useHttpClient();

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
              value: responseData.message.invoiceSeries,
              isValid: true,
            },
            invoiceStartNumber: {
              value: responseData.message.invoiceStartNumber,
              isValid: true,
            },
            bank: {
              value: responseData.message.bank,
              isValid: true,
            },
            iban: {
              value: responseData.message.iban,
              isValid: true,
            },
            invoiceTemplate: {
              value: responseData.message.invoiceTemplate,
              isValid: true,
            },
            invoiceNotes: {
              value: responseData.message.invoiceNotes,
              isValid: true,
            },
          },
          true
        );
      } catch (error) {}
    };
    getUserData();
  }, [sendRequest, setFormData, token]);

  const updateHandler = async (e) => {
    e.preventDefault();
    try {
      await sendRequest(
        'http://localhost:8000/user/update',
        'POST',
        JSON.stringify({
          invoiceSeries: formState.inputs.invoiceSeries.value,
          invoiceStartNumber: formState.inputs.invoiceStartNumber.value,
          bank: formState.inputs.bank.value,
          iban: formState.inputs.iban.value,
          invoiceTemplate: formState.inputs.invoiceTemplate.value,
          invoiceNotes: formState.inputs.invoiceNotes.value,
        }),
        { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }
      );
      setSuccessMessage('Utilizatorul a fost modificat cu succes');
      props.onCloseModal();
    } catch (error) {}
  };

  const closeModalReset = () => {
    props.onCloseModal();
    setSuccessMessage(null);
  };

  const clearSuccessMessage = () => {
    props.onRefresh();
    setSuccessMessage(null);
  };

  const header = `Actualizeaza informatiile de facturare`;

  return (
    <React.Fragment>
      <ErrorModal show={error} onClear={clearError} />
      <SuccessModal success={successMessage} onClear={clearSuccessMessage} />

      {!successMessage && (
        <Modal
          medium
          form
          header={header}
          show={props.show}
          close={closeModalReset}
          onSubmit={updateHandler}
        >
          {isLoading && <LoadingSpinner asOverlay />}
          {!isLoading && (
            <div className="updateProfileBody grid2Col">
              <div className="formGroup flexColumn">
                <Input
                  className="input"
                  element="input"
                  id="invoiceSeries"
                  type="text"
                  label="Seria facturilor"
                  onInput={inputHandler}
                  validators={[]}
                  defaultValue={formState.inputs.invoiceSeries.value}
                  defaultValidity={formState.inputs.invoiceSeries.isValid}
                />
                <Input
                  className="input"
                  element="input"
                  id="invoiceStartNumber"
                  type="text"
                  label="Numarul de la care incep facturile"
                  onInput={inputHandler}
                  validators={[]}
                  defaultValue={formState.inputs.invoiceStartNumber.value}
                  defaultValidity={formState.inputs.invoiceStartNumber.isValid}
                />
                <Input
                  className="input"
                  element="input"
                  id="bank"
                  type="text"
                  label="Banca"
                  onInput={inputHandler}
                  validators={[]}
                  defaultValue={formState.inputs.bank.value}
                  defaultValidity={formState.inputs.bank.isValid}
                />
                <Input
                  className="input"
                  element="input"
                  id="iban"
                  type="text"
                  label="IBAN"
                  onInput={inputHandler}
                  validators={[]}
                  defaultValue={formState.inputs.iban.value}
                  defaultValidity={formState.inputs.iban.isValid}
                />
              </div>
              <div className="formGroup flexColumn">
                <Input
                  className="textarea"
                  element="textarea"
                  id="invoiceTemplate"
                  label="Formula de trimitere a facturilor"
                  validators={[]}
                  defaultValue={formState.inputs.invoiceTemplate.value}
                  defaultValidity={formState.inputs.invoiceTemplate.isValid}
                  onInput={inputHandler}
                />
                <Input
                  className="textarea"
                  element="textarea"
                  id="invoiceNotes"
                  label="Include urmatoarele mentiuni in facturi:"
                  validators={[]}
                  defaultValue={formState.inputs.invoiceNotes.value}
                  defaultValidity={formState.inputs.invoiceNotes.isValid}
                  onInput={inputHandler}
                />
              </div>
              <div className="formActions">
                <Button primary type="submit">
                  SALVEAZA
                </Button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </React.Fragment>
  );
};

export default UpdateInvoicingData;

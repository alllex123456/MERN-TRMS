import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';

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
import { VALIDATOR_REQUIRE } from '../../../../utilities/form-validator';

const UpdateInvoicingData = (props) => {
  const { token, language } = useContext(AuthContext);
  const [successMessage, setSuccessMessage] = useState();

  const { t } = useTranslation();

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
          `${process.env.REACT_APP_BACKEND_URL}/user`,
          'GET',
          null,
          { Authorization: 'Bearer ' + token, 'Accept-Language': language }
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
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/user/update`,
        'POST',
        JSON.stringify({
          invoiceSeries: formState.inputs.invoiceSeries.value,
          invoiceStartNumber: formState.inputs.invoiceStartNumber.value,
          bank: formState.inputs.bank.value,
          iban: formState.inputs.iban.value,
          invoiceTemplate: formState.inputs.invoiceTemplate.value,
          invoiceNotes: formState.inputs.invoiceNotes.value,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
          'Accept-Language': language,
        }
      );
      setSuccessMessage(responseData.confirmation);
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

  const header = t('modals.user.invoicingData.header');

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
                  label={t('modals.user.invoicingData.series')}
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
                  label={t('modals.user.invoicingData.number')}
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
                  label={t('modals.user.invoicingData.bank')}
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
                  label={t('modals.user.invoicingData.iban')}
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
                  label={t('modals.user.invoicingData.message')}
                  validators={[]}
                  defaultValue={formState.inputs.invoiceTemplate.value}
                  defaultValidity={formState.inputs.invoiceTemplate.isValid}
                  onInput={inputHandler}
                />
                <Input
                  className="textarea"
                  element="textarea"
                  id="invoiceNotes"
                  label={t('modals.user.invoicingData.notes')}
                  validators={[]}
                  defaultValue={formState.inputs.invoiceNotes.value}
                  defaultValidity={formState.inputs.invoiceNotes.isValid}
                  onInput={inputHandler}
                />
              </div>
              <div className="formActions">
                <Button primary type="submit">
                  {t('buttons.saveBtn')}
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

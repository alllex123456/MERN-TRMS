import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../UIElements/Button';
import Input from '../../FormElements/Input';
import Modal from '../../UIElements/Modal';
import LoadingSpinner from '../../UIElements/LoadingSpinner';
import ErrorModal from '../MessageModals/ErrorModal';
import SuccessModal from '../../Modals/MessageModals/SuccessModal';

import { useForm } from '../../../../hooks/useForm';
import { useHttpClient } from '../../../../hooks/useHttpClient';
import { AuthContext } from '../../../../context/auth-context';
import { VALIDATOR_REQUIRE } from '../../../../utilities/form-validator';

import '../../CSS/modals-form.css';

const CompleteModal = (props) => {
  const { token, userId, language } = useContext(AuthContext);
  const [loadedData, setLoadedData] = useState();
  const [successMessage, setSuccessMessage] = useState();

  const { t } = useTranslation();

  const [formState, inputHandler, setFormData] = useForm(
    {
      completeReference: { value: '', isValid: true },
      completeClient: { value: '', isValid: true },
      completeReceived: {
        value: '',
        isValid: true,
      },
      completeDeadline: { value: '', isValid: true },
      completeRate: { value: '', isValid: true },
      completeCount: { value: '', isValid: true },
      completeNotes: { value: '', isValid: true },
    },
    true
  );

  const { sendRequest, isLoading, error, clearError } = useHttpClient();

  useEffect(() => {
    const getOrderData = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/orders/${props.orderId}`,
          'GET',
          null,
          { Authorization: 'Bearer ' + token, 'Accept-Language': language }
        );

        setFormData(
          {
            completeReference: {
              value: responseData.message.reference,
              isValid: true,
            },
            completeClient: {
              value: responseData.message.clientId.name,
              isValid: true,
            },
            completeReceived: {
              value: responseData.message.receivedDate,
              isValid: true,
            },
            completeDeadline: {
              value: responseData.message.deadline,
              isValid: true,
            },
            completeRate: { value: responseData.message.rate, isValid: true },
            completeCount: {
              value: responseData.message.count,
              isValid: true,
            },
            completeNotes: { value: responseData.message.notes, isValid: true },
          },
          true
        );
        setLoadedData(responseData.message);
      } catch (error) {}
    };
    getOrderData();
  }, [props.orderId, sendRequest, setFormData, token]);

  const completeHandler = async (event) => {
    event.preventDefault();

    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/orders/complete-order`,
        'POST',
        JSON.stringify({
          userId,
          orderId: props.orderId,
          reference: formState.inputs.completeReference.value,
          rate: formState.inputs.completeRate.value,
          count: formState.inputs.completeCount.value,
          notes: formState.inputs.completeNotes.value,
          deliveredDate: new Date().toISOString(),
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
          'Accept-Language': language,
        }
      );
      setSuccessMessage(responseData.message);
      props.onCompleteOrder();
      props.onCloseModal();
    } catch (error) {}

    props.onCompleteOrder();
  };

  const clearSuccessMessage = () => {
    setSuccessMessage(null);
  };

  const header = t('modals.orders.completeOrder.header');

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <SuccessModal success={successMessage} onClear={clearSuccessMessage} />
      {!error && !successMessage && loadedData && (
        <Modal
          medium
          form
          header={header}
          show={props.show}
          close={props.onCloseModal}
          onSubmit={completeHandler}
        >
          {isLoading && <LoadingSpinner asOverlay />}
          {!isLoading && (
            <div className="completeOrder">
              <div className="formGroup flexColumn">
                <Input
                  disabled
                  className="input"
                  label={t('orders.client')}
                  element="input"
                  id="completeClient"
                  defaultValue={loadedData.clientId.name}
                  defaultValidity={true}
                  validators={[VALIDATOR_REQUIRE()]}
                  onInput={inputHandler}
                />
                <Input
                  disabled
                  className="input"
                  label={t('orders.reference')}
                  element="input"
                  id="completeReference"
                  defaultValue={formState.inputs.completeReference.value}
                  defaultValidity={true}
                  validators={[]}
                  onInput={inputHandler}
                />

                <Input
                  disabled
                  className="input"
                  label={t('orders.receivedDate')}
                  element="input"
                  id="completeReceived"
                  type="datetime"
                  defaultValue={new Date(loadedData.receivedDate)
                    .toLocaleString()
                    .slice(0, 17)}
                  defaultValidity={true}
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText={t('modals.orders.addOrder.receivedDateErrorText')}
                  onInput={inputHandler}
                />
                <Input
                  disabled
                  className="input"
                  label={t('orders.deadline')}
                  element="input"
                  id="completeDeadline"
                  type="datetime"
                  defaultValue={new Date(loadedData.deadline)
                    .toLocaleString()
                    .slice(0, 17)}
                  validators={[]}
                  defaultValidity={true}
                  onInput={inputHandler}
                />
              </div>
              <div className="formGroup modalGroup flexColumn">
                <Input
                  className="input required"
                  label={t('orders.rate')}
                  element="input"
                  id="completeRate"
                  type="number"
                  step="0.01"
                  defaultValue={loadedData.rate}
                  defaultValidity={formState.inputs.completeRate.isValid}
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText={t('modals.orders.addOrder.rateErrorText')}
                  onInput={inputHandler}
                />
                <Input
                  className="input required"
                  label={t('orders.finalCount')}
                  element="input"
                  id="completeCount"
                  type="number"
                  step="0.01"
                  defaultValue={formState.inputs.completeCount.value}
                  defaultValidity={formState.inputs.completeCount.isValid}
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText={t(
                    'modals.orders.completeOrder.finalCountErrorText'
                  )}
                  onInput={inputHandler}
                />
                <Input
                  className="input"
                  label={t('orders.notes')}
                  element="input"
                  id="completeNotes"
                  defaultValue={formState.inputs.completeNotes.value}
                  defaultValidity={true}
                  validators={[]}
                  onInput={inputHandler}
                />
              </div>

              <div className="formActions">
                <Button primary type="submit" disabled={!formState.isValid}>
                  {t('buttons.completeBtn')}
                </Button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </React.Fragment>
  );
};

export default CompleteModal;

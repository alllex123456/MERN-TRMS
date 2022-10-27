import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../UIElements/Button';
import Input from '../../FormElements/Input';
import Modal from '../../UIElements/Modal';
import ErrorModal from '../MessageModals/ErrorModal';
import LoadingSpinner from '../../UIElements/LoadingSpinner';
import SuccessModal from '../../Modals/MessageModals/SuccessModal';

import { VALIDATOR_REQUIRE } from '../../../../utilities/form-validator';
import { localISOTime } from '../../../../utilities/ISO-offset';
import { useForm } from '../../../../hooks/useForm';
import { useHttpClient } from '../../../../hooks/useHttpClient';
import { AuthContext } from '../../../../context/auth-context';

import '../../CSS/modals-form.css';

const EditModal = (props) => {
  const { token, language } = useContext(AuthContext);
  const [loadedData, setLoadedData] = useState();
  const [successMessage, setSuccessMessage] = useState();

  const { t } = useTranslation();

  const [formState, inputHandler, setFormData] = useForm(
    {
      editReference: { value: '', isValid: true },
      editClient: { value: '', isValid: true },
      editReceived: {
        value: '',
        isValid: true,
      },
      editDeadline: {
        value: '',
        isValid: true,
      },
      editRate: { value: '', isValid: true },
      editCount: { value: '', isValid: true },
      editNotes: { value: '', isValid: true },
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
            editReference: {
              value: responseData.message.reference,
              isValid: true,
            },
            editClient: {
              value: responseData.message.clientId.name,
              isValid: true,
            },
            editReceived: {
              value: responseData.message.receivedDate,
              isValid: true,
            },
            editDeadline: {
              value: responseData.message.deadline,
              isValid: true,
            },
            editRate: { value: responseData.message.rate, isValid: true },
            editCount: {
              value: responseData.message.count,
              isValid: true,
            },
            editNotes: { value: responseData.message.notes, isValid: true },
          },
          true
        );
        setLoadedData(responseData.message);
      } catch (error) {}
    };
    getOrderData();
  }, [props.orderId, sendRequest, setFormData, token]);

  const editHandler = async (event) => {
    event.preventDefault();

    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/orders/modify-order`,
        'PATCH',
        JSON.stringify({
          orderId: props.orderId,
          rate: formState.inputs.editRate.value,
          count: formState.inputs.editCount.value,
          deadline: formState.inputs.editDeadline.value,
          reference: formState.inputs.editReference.value,
          notes: formState.inputs.editNotes.value,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
          'Accept-Language': language,
        }
      );
      props.onEditOrder();
      props.onCloseModal();
      setSuccessMessage(responseData.message);
    } catch (error) {}
    props.onEditOrder();
  };

  const clearSuccessMessage = () => {
    setSuccessMessage(null);
  };

  const closeModalHandler = () => {
    props.onCloseModal();
    setSuccessMessage(null);
  };
  const header = t('modals.orders.editOrder.header');

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <SuccessModal success={successMessage} onClear={clearSuccessMessage} />
      {!error && !successMessage && (
        <Modal
          form
          header={header}
          show={props.show}
          close={closeModalHandler}
          onSubmit={editHandler}
        >
          {isLoading && <LoadingSpinner asOverlay />}
          {!isLoading && loadedData && (
            <div className="editOrder">
              <div className="formGroup flexColumn">
                <Input
                  disabled
                  className="input"
                  label={t('orders.client')}
                  element="input"
                  id="editClient"
                  defaultValue={formState.inputs.editClient.value}
                  defaultValidity={formState.inputs.editClient.isValid}
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText={t('modals.orders.addOrder.clientErrorText')}
                  onInput={inputHandler}
                />
                <Input
                  className="input"
                  label={t('orders.reference')}
                  element="input"
                  id="editReference"
                  defaultValue={formState.inputs.editReference.value}
                  defaultValidity={formState.inputs.editReference.isValid}
                  validators={[]}
                  onInput={inputHandler}
                />
                <Input
                  className="input"
                  label={t('orders.rate')}
                  element="input"
                  id="editRate"
                  type="number"
                  step="0.01"
                  defaultValue={formState.inputs.editRate.value}
                  defaultValidity={formState.inputs.editRate.isValid}
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText={t('modals.orders.addOrder.rateErrorText')}
                  onInput={inputHandler}
                />

                <Input
                  className="input"
                  label={t('orders.estimatedCount')}
                  element="input"
                  id="editCount"
                  type="number"
                  step="0.01"
                  defaultValue={formState.inputs.editCount.value}
                  defaultValidity={formState.inputs.editCount.isValid}
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText={t(
                    'modals.orders.addOrder.estimatedCountErrorText'
                  )}
                  onInput={inputHandler}
                />
              </div>
              <div className="formGroup flexColumn">
                <Input
                  disabled
                  className="input"
                  label={t('orders.receivedDate')}
                  element="input"
                  id="editReceived"
                  type="datetime"
                  defaultValue={new Date(loadedData.receivedDate)
                    .toLocaleString()
                    .slice(0, 17)}
                  defaultValidity={formState.inputs.editReceived.isValid}
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText={t('modals.orders.addOrder.receivedDateErrorText')}
                  onInput={inputHandler}
                />

                <Input
                  disabled
                  className="input"
                  label={t('orders.deadline')}
                  element="input"
                  id="editDeadline"
                  type="datetime"
                  defaultValue={new Date(formState.inputs.editDeadline.value)
                    .toLocaleString()
                    .slice(0, 17)}
                  validators={[]}
                  onInput={inputHandler}
                />
                <Input
                  className="input"
                  label={t('modals.orders.editOrder.changeDeadline')}
                  element="input"
                  id="editDeadline"
                  type="datetime-local"
                  validators={[]}
                  defaultValue={localISOTime(
                    new Date(formState.inputs.editDeadline.value)
                  )}
                  defaultValidity={formState.inputs.editDeadline.isValid}
                  onInput={inputHandler}
                />
                <Input
                  className="textarea"
                  label={t('orders.notes')}
                  element="input"
                  id="editNotes"
                  defaultValue={formState.inputs.editNotes.value}
                  defaultValidity={formState.inputs.editNotes.isValid}
                  validators={[]}
                  onInput={inputHandler}
                />
              </div>

              <div className="formActions">
                <Button primary type="submit" disabled={!formState.isValid}>
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

export default EditModal;

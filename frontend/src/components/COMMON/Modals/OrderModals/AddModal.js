import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../UIElements/Button';
import Input from '../../FormElements/Input';
import Modal from '../../UIElements/Modal';
import LoadingSpinner from '../../UIElements/LoadingSpinner';
import ErrorModal from '../MessageModals/ErrorModal';

import { useLocation } from 'react-router-dom';
import { VALIDATOR_REQUIRE } from '../../../../utilities/form-validator';
import { localISOTime } from '../../../../utilities/ISO-offset';
import { useForm } from '../../../../hooks/useForm';
import { useHttpClient } from '../../../../hooks/useHttpClient';
import { AuthContext } from '../../../../context/auth-context';
import { getReadableUnit } from '../../../../utilities/get-units';

import '../../CSS/modals-form.css';

const AddModal = (props) => {
  const { token, units, services, language } = useContext(AuthContext);
  const [successMessage, setSuccessMessage] = useState();
  const [clients, setClients] = useState();
  const [client, setClient] = useState();
  const location = useLocation();

  const { t } = useTranslation();

  const [formState, inputHandler, setFormData] = useForm(
    {
      addService: { value: '', isValid: true },
      addReference: { value: '', isValid: true },
      addClient: { value: '', isValid: false },
      addReceived: {
        value: localISOTime(Date.now()),
        isValid: true,
      },
      addDeadline: {
        value: localISOTime(Date.now()),
        isValid: true,
      },
      addRate: { value: '', isValid: false },
      addUnit: { value: '', isValid: false },
      addCurrency: { value: '', isValid: false },
      addCount: { value: '', isValid: false },
      addNotes: { value: '', isValid: true },
    },
    false
  );

  const { sendRequest, isLoading, error, clearError } = useHttpClient();

  useEffect(() => {
    if (props.addToStatement) {
      try {
        const getFormData = async () => {
          const userClient = await sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/clients/client/${props.clientId}`,
            'GET',
            null,
            { Authorization: 'Bearer ' + token, 'Accept-Language': language }
          );
          setClient(userClient.message);
          setFormData(
            {
              addService: { value: services[0].value, isValid: true },
              addReference: { value: '', isValid: true },
              addClient: { value: userClient.message.id, isValid: true },
              addReceived: {
                value: localISOTime(Date.now()),
                isValid: true,
              },
              addDeadline: {
                value: localISOTime(Date.now()),
                isValid: true,
              },
              addRate: {
                value: userClient.message[`${services[0].value}Rate`],
                isValid: true,
              },
              addUnit: { value: userClient.message.unit, isValid: true },
              addCurrency: {
                value: userClient.message.currency,
                isValid: true,
              },
              addCount: { value: '', isValid: false },
              addNotes: { value: '', isValid: true },
            },
            false
          );
        };
        getFormData();
      } catch (error) {}
    }
  }, [
    sendRequest,
    props.addToStatement,
    props.clientId,
    setFormData,
    services,
    token,
  ]);

  useEffect(() => {
    if (!props.addToStatement) {
      try {
        const getFormData = async () => {
          const userClients = await sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/clients`,
            'GET',
            null,
            { Authorization: 'Bearer ' + token, 'Accept-Language': language }
          );
          setClients(userClients.message.clients);
        };
        getFormData();
      } catch (error) {}
    }
  }, [sendRequest, props.addToStatement, token]);

  const setRateHandler = async (clientId) => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/clients/client/${clientId}`,
        'GET',
        null,
        { Authorization: 'Bearer ' + token, 'Accept-Language': language }
      );

      setFormData(
        {
          ...formState.inputs,
          addClient: { value: responseData.message.id, isValid: true },
          addRate: {
            value:
              responseData.message[`${formState.inputs.addService.value}Rate`],
            isValid: true,
          },
          addUnit: { value: responseData.message.unit, isValid: true },
          addCurrency: { value: responseData.message.currency, isValid: true },
        },
        false
      );
    } catch (error) {}
  };

  const addHandler = async (event) => {
    event.preventDefault();
    setSuccessMessage(null);
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/orders/add-order`,
        'POST',
        JSON.stringify({
          addToStatement:
            location.pathname ===
            `/statements/${formState.inputs.addClient.value}`,
          service: formState.inputs.addService.value,
          ref: formState.inputs.addReference.value,
          clientId: formState.inputs.addClient.value,
          receivedDate: localISOTime(Date.now()),
          deadline: formState.inputs.addDeadline.value,
          rate: +formState.inputs.addRate.value,
          unit: formState.inputs.addUnit.value,
          currency: formState.inputs.addCurrency.value,
          count: formState.inputs.addCount.value,
          notes: formState.inputs.addNotes.value,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
          'Accept-Language': language,
        }
      );
      setSuccessMessage(responseData.confirmation);
      setFormData(
        {
          ...formState.inputs,
          addReceived: {
            value: localISOTime(Date.now()),
            isValid: true,
          },
          addDeadline: {
            value: localISOTime(Date.now()),
            isValid: true,
          },
        },
        false
      );

      props.onAddOrder();
    } catch (error) {}
    props.onAddOrder();
  };

  const closeModalHandler = () => {
    props.onCloseModal();
    setFormData(
      {
        addService: { value: '', isValid: true },
        addReference: { value: '', isValid: true },
        addClient: { value: '', isValid: false },
        addReceived: {
          value: localISOTime(Date.now()),
          isValid: true,
        },
        addDeadline: {
          value: localISOTime(Date.now()),
          isValid: true,
        },
        addRate: { value: '', isValid: false },
        addUnit: { value: '', isValid: false },
        addCurrency: { value: '', isValid: false },
        addCount: { value: '', isValid: false },
        addNotes: { value: '', isValid: true },
      },
      false
    );
    setSuccessMessage(null);
  };

  const changeServiceHandler = async (service) => {
    if (!formState.inputs.addClient.value) return;
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/clients/client/${formState.inputs.addClient.value}`,
        'GET',
        null,
        { Authorization: 'Bearer ' + token, 'Accept-Language': language }
      );
      setFormData(
        {
          ...formState.inputs,
          addService: { value: service, isValid: true },
          addClient: { value: responseData.message.id, isValid: true },
          addRate: {
            value: responseData.message[`${service}Rate`],
            isValid: true,
          },
          addUnit: { value: responseData.message.unit, isValid: true },
          addCurrency: {
            value: responseData.message.currency,
            isValid: true,
          },
        },
        false
      );
    } catch (error) {}
  };

  const header = t('modals.orders.addOrder.header');

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        form
        header={header}
        show={props.show}
        close={closeModalHandler}
        onSubmit={addHandler}
      >
        {isLoading && <LoadingSpinner asOverlay />}
        <div className="addOrder">
          <div className="formGroup flexColumn">
            <Input
              className="input"
              element="select"
              id="addService"
              label={t('orders.service')}
              validators={[VALIDATOR_REQUIRE()]}
              errorText={t('modals.orders.addOrder.serviceErrorText')}
              defaultValue={services[0].value}
              defaultValidity={formState.inputs.addService.isValid}
              onInput={inputHandler}
              onChangeService={changeServiceHandler}
            >
              {services.map((service) => (
                <option key={service.value} value={service.value}>
                  {service.displayedValue}
                </option>
              ))}
            </Input>
            {!props.addToStatement && !isLoading && (
              <Input
                className="input"
                element="select"
                id="addClient"
                label={t('orders.client')}
                validators={[VALIDATOR_REQUIRE()]}
                errorText={t('modals.orders.addOrder.clientErrorText')}
                defaultValue={formState.inputs.addClient.value}
                defaultValidity={formState.inputs.addClient.isValid}
                onInput={inputHandler}
                onSelectClient={setRateHandler}
              >
                <option>{t('modals.orders.addOrder.selectClient')}</option>
                {!props.addToStatement &&
                  clients &&
                  clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
              </Input>
            )}
            {props.addToStatement && client && (
              <Input
                className="input"
                element="select"
                id="addClient"
                label={t('orders.client')}
                validators={[VALIDATOR_REQUIRE()]}
                errorText={t('modals.orders.addOrder.clientErrorText')}
                defaultValue={formState.inputs.addClient.value}
                defaultValidity={true}
                onInput={inputHandler}
                onSelectClient={setRateHandler}
              >
                <option>{client.name}</option>
              </Input>
            )}

            {!isLoading && (
              <Input
                className="input"
                element="input"
                id="addReference"
                label={t('orders.reference')}
                type="text"
                defaultValidity={formState.inputs.addReference.isValid}
                validators={[]}
                onInput={inputHandler}
              />
            )}
          </div>
          <div className="formGroup flexColumn">
            {!isLoading && (
              <Input
                className="input"
                element="input"
                id="addReceived"
                label={t('orders.receivedDate')}
                type="datetime-local"
                defaultValue={formState.inputs.addReceived.value}
                defaultValidity={true}
                validators={[VALIDATOR_REQUIRE()]}
                errorText={t('modals.orders.addOrder.receivedDateErrorText')}
                onInput={inputHandler}
              />
            )}
            {!isLoading && (
              <Input
                className="input"
                element="input"
                id="addDeadline"
                label={t('orders.deadline')}
                type="datetime-local"
                validators={[VALIDATOR_REQUIRE()]}
                errorText={t('modals.orders.addOrder.deadlineErrorText')}
                defaultValue={formState.inputs.addDeadline.value}
                defaultValidity={true}
                onInput={inputHandler}
              />
            )}
            {!isLoading && (
              <Input
                className="input"
                element="input"
                id="addRate"
                label={t('orders.rate')}
                type="number"
                step="0.01"
                validators={[VALIDATOR_REQUIRE()]}
                errorText={t('modals.orders.addOrder.rateErrorText')}
                defaultValue={formState.inputs.addRate.value}
                defaultValidity={formState.inputs.addRate.isValid}
                onInput={inputHandler}
                noVal="0"
              />
            )}
          </div>
          <div className="formGroup flexColumn">
            {!isLoading && (
              <Input
                className="input"
                element="select"
                id="addUnit"
                label={t('orders.mu')}
                validators={[VALIDATOR_REQUIRE()]}
                errorText={t('modals.orders.addOrder.muErrorText')}
                defaultValue={formState.inputs.addUnit.value}
                defaultValidity={formState.inputs.addUnit.isValid}
                onInput={inputHandler}
              >
                <option value={formState.inputs.addUnit.value}>
                  {getReadableUnit(units, formState.inputs.addUnit.value)}
                </option>
                {units
                  .filter(
                    (unit) => unit.value !== formState.inputs.addUnit.value
                  )
                  .map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.displayedValue}
                    </option>
                  ))}
              </Input>
            )}

            <section>
              {!isLoading && (
                <Input
                  className="input"
                  element="input"
                  id="addCount"
                  label={t('orders.estimatedCount')}
                  type="number"
                  step="0.01"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText={t(
                    'modals.orders.addOrder.estimatedCountErrorText'
                  )}
                  defaultValue={formState.inputs.addCount.value}
                  defaultValidity={formState.inputs.addCount.isValid}
                  onInput={inputHandler}
                />
              )}
            </section>
            <Input
              className="textarea"
              element="input"
              id="addNotes"
              label={t('orders.notes')}
              validators={[]}
              defaultValidity={formState.inputs.addNotes.isValid}
              onInput={inputHandler}
            />
          </div>

          <div className="formActions">
            <Button primary type="submit" disabled={!formState.isValid}>
              {t('buttons.saveBtn')}
            </Button>

            {successMessage && <p className="success">{successMessage}</p>}
          </div>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default AddModal;

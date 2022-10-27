import React, { useState, useRef, useEffect, useContext } from 'react';
import { FileImage } from 'phosphor-react';
import { useTranslation } from 'react-i18next';

import Button from '../../UIElements/Button';
import Input from '../../FormElements/Input';
import Modal from '../../UIElements/Modal';
import LoadingSpinner from '../../UIElements/LoadingSpinner';
import ErrorModal from '../../Modals/MessageModals/ErrorModal';
import SuccessModal from '../../Modals/MessageModals/SuccessModal';

import { useForm } from '../../../../hooks/useForm';
import { useHttpClient } from '../../../../hooks/useHttpClient';
import { AuthContext } from '../../../../context/auth-context';
import { getReadableUnit } from '../../../../utilities/get-units';
import { VALIDATOR_REQUIRE } from '../../../../utilities/form-validator';

import '../../CSS/modals-form.css';

const EditModal = ({ show, clientData, onCloseModal, refreshClients }) => {
  const { token, units, language } = useContext(AuthContext);
  const [file, setFile] = useState();
  const [avatarPreview, setAvatarPreview] = useState();
  const [loadedData, setLoadedData] = useState();
  const [successMessage, setSuccessMessage] = useState();

  const { t } = useTranslation();

  const [formState, inputHandler, setFormData] = useForm(
    {
      avatar: { value: '', isValid: true },
      name: { value: '', isValid: true },
      email: { value: '', isValid: true },
      phone: { value: '', isValid: true },
      translationRate: { value: '', isValid: true },
      proofreadingRate: { value: '', isValid: true },
      posteditingRate: { value: '', isValid: true },
      currency: { value: '', isValid: true },
      unit: { value: '', isValid: true },
      registeredOffice: {
        value: '',
        isValid: true,
      },
      registrationNumber: {
        value: '',
        isValid: true,
      },
      taxNumber: { value: '', isValid: true },
      bank: { value: '', isValid: true },
      iban: { value: '', isValid: true },
      representative: { value: '', isValid: true },
      notes: { value: '', isValid: true },
      invoiceDue: { value: '', isValid: true },
      decimalPoints: { value: '', isValid: true },
    },
    true
  );

  const filePicker = useRef();

  const getFilePicker = () => filePicker.current.click();

  const filePickerHandler = (e) => {
    if (e.target.files && e.target.files.length === 1) {
      const pickedFile = e.target.files[0];
      setFile(pickedFile);

      setFormData(
        {
          avatar: { value: pickedFile, isValid: true },
          name: { value: loadedData.name, isValid: true },
          email: { value: loadedData.email, isValid: true },
          phone: { value: loadedData.phone, isValid: true },
          translationRate: { value: loadedData.translationRate, isValid: true },
          proofreadingRate: {
            value: loadedData.proofreadingRate,
            isValid: true,
          },
          posteditingRate: { value: loadedData.posteditingRate, isValid: true },
          currency: {
            value: loadedData.currency,
            isValid: true,
          },
          unit: { value: loadedData.unit, isValid: true },
          registeredOffice: {
            value: loadedData.registeredOffice,
            isValid: true,
          },
          registrationNumber: {
            value: loadedData.registrationNumber,
            isValid: true,
          },
          taxNumber: {
            value: loadedData.taxNumber,
            isValid: true,
          },
          bank: { value: loadedData.bank, isValid: true },
          iban: { value: loadedData.iban, isValid: true },
          notes: { value: loadedData.notes, isValid: true },
          representative: { value: loadedData.representative, isValid: true },
          invoiceDue: { value: '', isValid: true },
          decimalPoints: { value: '', isValid: true },
        },
        true
      );
    }
  };

  const { sendRequest, isLoading, error, clearError } = useHttpClient();

  useEffect(() => {
    if (!file) return;
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setAvatarPreview(fileReader.result);
    };
    fileReader.readAsDataURL(file);

    return () => setAvatarPreview(null);
  }, [file]);

  useEffect(() => {
    const getClientData = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/clients/client/${clientData.id}`,
          'GET',
          null,
          { Authorization: 'Bearer ' + token, 'Accept-Language': language }
        );

        setLoadedData(responseData.message);

        setFormData(
          {
            avatar: { value: responseData.message.avatar, isValid: true },
            name: { value: responseData.message.name, isValid: true },
            email: { value: responseData.message.email, isValid: true },
            phone: { value: responseData.message.phone, isValid: true },
            translationRate: {
              value: responseData.message.translationRate,
              isValid: true,
            },
            proofreadingRate: {
              value: responseData.message.proofreadingRate,
              isValid: true,
            },
            posteditingRate: {
              value: responseData.message.posteditingRate,
              isValid: true,
            },
            currency: {
              value: responseData.message.currency,
              isValid: true,
            },
            unit: { value: responseData.message.unit, isValid: true },
            registeredOffice: {
              value: responseData.message.registeredOffice,
              isValid: true,
            },
            registrationNumber: {
              value: responseData.message.registrationNumber,
              isValid: true,
            },
            taxNumber: {
              value: responseData.message.taxNumber,
              isValid: true,
            },
            bank: { value: responseData.message.bank, isValid: true },
            iban: { value: responseData.message.iban, isValid: true },
            notes: { value: responseData.message.notes, isValid: true },
            representative: {
              value: responseData.message.representative,
              isValid: true,
            },
            invoiceDue: {
              value: responseData.message.invoiceDue,
              isValid: true,
            },
            decimalPoints: {
              value: responseData.message.decimalPoints,
              isValid: true,
            },
          },
          true
        );
      } catch (error) {}
    };
    getClientData();
  }, [sendRequest, clientData.id, setFormData, token]);

  const editHandler = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('clientId', clientData.id);

    for (const [key, value] of Object.entries(formState.inputs)) {
      if (value.value) {
        formData.append(key, value.value);
      }
    }

    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/clients/modify-client`,
        'PATCH',
        formData,
        { Authorization: 'Bearer ' + token, 'Accept-Language': language }
      );
      setSuccessMessage(responseData.confirmation);
      refreshClients();
    } catch (error) {}

    onCloseModal();
    refreshClients();
  };

  const closeModalHandler = () => {
    onCloseModal();
    setSuccessMessage(null);
  };

  const clearSuccessMessage = () => {
    setSuccessMessage(null);
  };

  const header = `${t('modals.clients.editClient.header')}: ${clientData.name}`;

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <SuccessModal success={successMessage} onClear={clearSuccessMessage} />
      {!error && !successMessage && loadedData && (
        <Modal
          medium
          form
          header={header}
          show={show}
          close={closeModalHandler}
          onSubmit={editHandler}
        >
          {isLoading && <LoadingSpinner asOverlay />}

          {!isLoading && loadedData && (
            <div className="editClient">
              <div className="formGroup flexColumn">
                <div className="clientAvatar">
                  {avatarPreview || formState.inputs.avatar.value ? (
                    <img
                      src={
                        typeof formState.inputs.avatar.value === 'object'
                          ? avatarPreview
                          : `http://localhost:8000/uploads/avatars/${formState.inputs.avatar.value}`
                      }
                    />
                  ) : (
                    <div className="blankAvatar" />
                  )}
                  <input
                    style={{ display: 'none' }}
                    type="file"
                    name="avatar"
                    ref={filePicker}
                    onChange={filePickerHandler}
                  />
                  <FileImage
                    className="changeClientAvatar"
                    size={48}
                    onClick={getFilePicker}
                  />
                </div>
                <Input
                  className="input"
                  label={t('client.name')}
                  element="input"
                  id="name"
                  defaultValue={formState.inputs.name.value}
                  defaultValidity={formState.inputs.name.isValid}
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText={t('modals.clients.addClient.nameErrorText')}
                  onInput={inputHandler}
                />
                <Input
                  className="input"
                  label={t('client.email')}
                  element="input"
                  id="email"
                  type="email"
                  validators={[]}
                  defaultValue={formState.inputs.email.value}
                  defaultValidity={formState.inputs.email.isValid}
                  onInput={inputHandler}
                />

                <Input
                  className="input"
                  label={t('client.phone')}
                  element="input"
                  id="phone"
                  type="phone"
                  defaultValue={formState.inputs.phone.value}
                  defaultValidity={formState.inputs.phone.isValid}
                  validators={[]}
                  onInput={inputHandler}
                />
                <div className="formGroup flexRow">
                  <Input
                    className="input"
                    label={t('client.translationRate')}
                    element="input"
                    id="translationRate"
                    type="number"
                    step="0.01"
                    defaultValue={formState.inputs.translationRate.value}
                    defaultValidity={formState.inputs.translationRate.isValid}
                    onInput={inputHandler}
                  />
                  <Input
                    className="input"
                    label={t('client.proofreadingRate')}
                    element="input"
                    id="proofreadingRate"
                    type="number"
                    step="0.01"
                    defaultValue={formState.inputs.proofreadingRate.value}
                    defaultValidity={formState.inputs.proofreadingRate.isValid}
                    onInput={inputHandler}
                  />
                  <Input
                    className="input"
                    label={t('client.posteditingRate')}
                    element="input"
                    id="posteditingRate"
                    type="number"
                    step="0.01"
                    defaultValue={formState.inputs.posteditingRate.value}
                    defaultValidity={formState.inputs.posteditingRate.isValid}
                    onInput={inputHandler}
                  />
                </div>
                <div className="formGroup flexRow">
                  <Input
                    disabled
                    className="input"
                    label={t('client.currency')}
                    element="input"
                    id="currency"
                    defaultValue={formState.inputs.currency.value}
                    defaultValidity={formState.inputs.currency.isValid}
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText={t('modals.clients.addClient.currencyErrorText')}
                    onInput={inputHandler}
                  >
                    <option value={clientData.currency}>
                      {clientData.currency}
                    </option>
                  </Input>

                  <Input
                    className="input"
                    label={t('client.mu')}
                    element="select"
                    id="unit"
                    defaultValue={formState.inputs.unit.value}
                    defaultValidity={formState.inputs.unit.isValid}
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText={t('modals.clients.addClient.muErrorText')}
                    onInput={inputHandler}
                  >
                    <option value={formState.inputs.unit.value}>
                      {getReadableUnit(units, formState.inputs.unit.value)}
                    </option>
                    {units
                      .filter(
                        (unit) => unit.value !== formState.inputs.unit.value
                      )
                      .map((unit) => (
                        <option key={unit.value} value={unit.value}>
                          {unit.displayedValue}
                        </option>
                      ))}
                  </Input>
                </div>
              </div>

              <div className="formGroup flexColumn">
                <Input
                  className="input"
                  label={t('client.registeredOffice')}
                  element="input"
                  id="registeredOffice"
                  type="text"
                  defaultValue={formState.inputs.registeredOffice.value}
                  defaultValidity={formState.inputs.registeredOffice.isValid}
                  validators={[]}
                  onInput={inputHandler}
                />

                <Input
                  className="input"
                  label={t('client.registrationNumber')}
                  element="input"
                  id="registrationNumber"
                  type="text"
                  defaultValue={formState.inputs.registrationNumber.value}
                  defaultValidity={formState.inputs.registrationNumber.isValid}
                  validators={[]}
                  onInput={inputHandler}
                />

                <Input
                  className="input"
                  label={t('client.taxNumber')}
                  element="input"
                  id="taxNumber"
                  type="text"
                  defaultValue={formState.inputs.taxNumber.value}
                  defaultValidity={formState.inputs.taxNumber.isValid}
                  validators={[]}
                  onInput={inputHandler}
                />

                <div className="formGroup flexRow">
                  <Input
                    className="input"
                    label={t('client.invoiceMaturity')}
                    element="input"
                    id="invoiceDue"
                    type="number"
                    validators={[]}
                    defaultValue={formState.inputs.invoiceDue.value}
                    defaultValidity={formState.inputs.invoiceDue.isValid}
                    onInput={inputHandler}
                  />
                  <Input
                    className="input"
                    label={t('client.decimalPoints')}
                    element="select"
                    id="decimalPoints"
                    type="number"
                    validators={[]}
                    defaultValue={formState.inputs.decimalPoints.value}
                    defaultValidity={formState.inputs.decimalPoints.isValid}
                    onInput={inputHandler}
                  >
                    <option value="0">0</option>
                    <option value="2">2</option>
                  </Input>
                </div>

                <Input
                  className="input"
                  label={t('client.bank')}
                  element="input"
                  id="bank"
                  type="text"
                  defaultValue={formState.inputs.bank.value}
                  defaultValidity={formState.inputs.bank.isValid}
                  validators={[]}
                  onInput={inputHandler}
                />

                <Input
                  className="input"
                  label={t('client.iban')}
                  element="input"
                  id="iban"
                  type="text"
                  defaultValue={formState.inputs.iban.value}
                  defaultValidity={formState.inputs.iban.isValid}
                  validators={[]}
                  onInput={inputHandler}
                />

                <Input
                  className="input"
                  label={t('client.legalrep')}
                  element="input"
                  id="representative"
                  type="text"
                  defaultValue={formState.inputs.representative.value}
                  defaultValidity={formState.inputs.representative.isValid}
                  validators={[]}
                  onInput={inputHandler}
                />

                <Input
                  className="textarea"
                  label={t('client.notes')}
                  element="textarea"
                  id="notes"
                  defaultValue={formState.inputs.notes.value}
                  defaultValidity={formState.inputs.notes.isValid}
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

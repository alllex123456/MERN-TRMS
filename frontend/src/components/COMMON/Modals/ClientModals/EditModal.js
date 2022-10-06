import React, { useState, useRef, useEffect, useContext } from 'react';
import { FileImage } from 'phosphor-react';

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
  const { token, units } = useContext(AuthContext);
  const [file, setFile] = useState();
  const [avatarPreview, setAvatarPreview] = useState();
  const [loadedData, setLoadedData] = useState();
  const [successMessage, setSuccessMessage] = useState();
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
      notes: { value: '', isValid: true },
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
          `http://localhost:8000/clients/client/${clientData.id}`,
          'GET',
          null,
          { Authorization: 'Bearer ' + token }
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
      await sendRequest(
        'http://localhost:8000/clients/modify-client',
        'PATCH',
        formData,
        { Authorization: 'Bearer ' + token }
      );
      setSuccessMessage('Clientul a fost modificat cu succes');
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

  const header = `Editează client: ${clientData.name}`;

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <SuccessModal success={successMessage} onClear={clearSuccessMessage} />
      {!error && !successMessage && loadedData && (
        <Modal
          form
          header={header}
          show={show}
          close={onCloseModal}
          onSubmit={editHandler}
        >
          {isLoading && <LoadingSpinner asOverlay />}

          {!isLoading && loadedData && (
            <div>
              <div className="formGroup flex">
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
                    className="changeProfileAvatar"
                    size={48}
                    onClick={getFilePicker}
                  />
                </div>
                <Input
                  className="input"
                  label="Numele:"
                  element="input"
                  id="name"
                  defaultValue={formState.inputs.name.value}
                  defaultValidity={formState.inputs.name.isValid}
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Nu a fost specificat un nume"
                  onInput={inputHandler}
                />
                <Input
                  className="input"
                  label="Email:"
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
                  label="Telefon:"
                  element="input"
                  id="phone"
                  type="phone"
                  defaultValue={formState.inputs.phone.value}
                  defaultValidity={formState.inputs.phone.isValid}
                  validators={[]}
                  onInput={inputHandler}
                />
              </div>

              <div className="formGroup flex">
                <Input
                  className="input"
                  label="Tarif traducere"
                  element="input"
                  id="translationRate"
                  type="number"
                  step="0.01"
                  defaultValue={formState.inputs.translationRate.value}
                  defaultValidity={formState.inputs.translationRate.isValid}
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Nu a fost specificat un tarif"
                  onInput={inputHandler}
                />
                <Input
                  className="input"
                  label="Tarif corectura"
                  element="input"
                  id="proofreadingRate"
                  type="number"
                  step="0.01"
                  defaultValue={formState.inputs.proofreadingRate.value}
                  defaultValidity={formState.inputs.proofreadingRate.isValid}
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Nu a fost specificat un tarif"
                  onInput={inputHandler}
                />
                <Input
                  className="input"
                  label="Tarif post-editare"
                  element="input"
                  id="posteditingRate"
                  type="number"
                  step="0.01"
                  defaultValue={formState.inputs.posteditingRate.value}
                  defaultValidity={formState.inputs.posteditingRate.isValid}
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Nu a fost specificat un tarif"
                  onInput={inputHandler}
                />

                <Input
                  disabled
                  className="input"
                  label="Monedă:"
                  element="input"
                  id="currency"
                  defaultValue={formState.inputs.currency.value}
                  defaultValidity={formState.inputs.currency.isValid}
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Nu a fost selectă moneda"
                  onInput={inputHandler}
                >
                  <option value={clientData.currency}>
                    {clientData.currency}
                  </option>
                </Input>

                <Input
                  className="input"
                  label="Unitate:"
                  element="select"
                  id="unit"
                  defaultValue={formState.inputs.unit.value}
                  defaultValidity={formState.inputs.unit.isValid}
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Nu a fost selectată o unitate de tarifare"
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
              <div className="formGroup flex">
                <Input
                  className="input"
                  label="Sediul:"
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
                  label="Nr. de înregistrare:"
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
                  label="Cod fiscal:"
                  element="input"
                  id="taxNumber"
                  type="text"
                  defaultValue={formState.inputs.taxNumber.value}
                  defaultValidity={formState.inputs.taxNumber.isValid}
                  validators={[]}
                  onInput={inputHandler}
                />
              </div>
              <div className="formGroup flex">
                <Input
                  className="input"
                  label="Banca:"
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
                  label="IBAN:"
                  element="input"
                  id="iban"
                  type="text"
                  defaultValue={formState.inputs.iban.value}
                  defaultValidity={formState.inputs.iban.isValid}
                  validators={[]}
                  onInput={inputHandler}
                />
              </div>
              <div className="formGroup">
                <Input
                  className="textarea"
                  label="Note:"
                  element="textarea"
                  id="notes"
                  defaultValue={formState.inputs.notes.value}
                  defaultValidity={formState.inputs.notes.isValid}
                  validators={[]}
                  onInput={inputHandler}
                />
              </div>

              <div className="formActions">
                <Button type="submit" disabled={!formState.isValid}>
                  SALVEAZĂ
                </Button>
                <Button type="button" danger onClick={closeModalHandler}>
                  ÎNCHIDE
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

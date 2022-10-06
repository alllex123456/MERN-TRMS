import React, { useState, useEffect, useContext } from 'react';

import Modal from '../../UIElements/Modal';
import Button from '../../UIElements/Button';
import Input from '../../FormElements/Input';

import { useForm } from '../../../../hooks/useForm';
import { useHttpClient } from '../../../../hooks/useHttpClient';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_REQUIRE,
} from '../../../../utilities/form-validator';

import '../../CSS/modals-form.css';
import '../../CSS/modals-layout.css';
import { AuthContext } from '../../../../context/auth-context';
import ErrorModal from '../MessageModals/ErrorModal';
import LoadingSpinner from '../../UIElements/LoadingSpinner';
import SuccessModal from '../MessageModals/SuccessModal';

const UpdateLegalData = (props) => {
  const { token } = useContext(AuthContext);
  const [successMessage, setSuccessMessage] = useState();

  const [formState, inputHandler, setFormData] = useForm(
    {
      name: { value: '', isValid: true },
      registeredOffice: { value: '', isValid: true },
      registrationNumber: { value: '', isValid: true },
      taxNumber: { value: '', isValid: true },
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
            name: { value: responseData.message.name, isValid: true },
            registeredOffice: {
              value: responseData.message.registeredOffice,
              isValid: true,
            },
            registrationNumber: {
              value: responseData.message.registrationNumber,
              isValid: true,
            },
            taxNumber: { value: responseData.message.taxNumber, isValid: true },
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
          name: formState.inputs.name.value,
          registeredOffice: formState.inputs.registeredOffice.value,
          registrationNumber: formState.inputs.registrationNumber.value,
          taxNumber: formState.inputs.taxNumber.value,
        }),
        { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }
      );
      setSuccessMessage('Utilizatorul a fost modificat cu succes');
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

  const header = `Actualizeaza informatiile personale`;

  return (
    <React.Fragment>
      <ErrorModal show={error} onClear={clearError} />
      <SuccessModal success={successMessage} onClear={clearSuccessMessage} />

      <Modal
        form
        header={header}
        show={props.show}
        close={closeModalReset}
        onSubmit={updateHandler}
      >
        {isLoading && <LoadingSpinner asOverlay />}
        {!isLoading && (
          <div className="updateProfileBody">
            <div className="formGroup">
              <Input
                className="input"
                element="input"
                id="name"
                type="text"
                label="Denumire PFA/Societate"
                onInput={inputHandler}
                validators={[]}
                defaultValue={formState.inputs.name.value}
                defaultValidity={formState.inputs.name.isValid}
              />
              <Input
                className="input"
                element="input"
                id="registeredOffice"
                type="text"
                label="Sediul"
                onInput={inputHandler}
                validators={[]}
                defaultValue={formState.inputs.registeredOffice.value}
                defaultValidity={formState.inputs.registeredOffice.isValid}
              />
              <Input
                className="input"
                element="input"
                id="registrationNumber"
                type="text"
                label="Numarul de inregistrare"
                onInput={inputHandler}
                validators={[]}
                defaultValue={formState.inputs.registrationNumber.value}
                defaultValidity={formState.inputs.registrationNumber.isValid}
              />
              <Input
                className="input"
                element="input"
                id="taxNumber"
                type="text"
                label="Cod fiscal"
                onInput={inputHandler}
                validators={[]}
                defaultValue={formState.inputs.taxNumber.value}
                defaultValidity={formState.inputs.taxNumber.isValid}
              />
            </div>
            <div className="formActions">
              <Button type="submit">SALVEAZA</Button>
              <Button type="button" danger onClick={closeModalReset}>
                INCHIDE
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </React.Fragment>
  );
};

export default UpdateLegalData;

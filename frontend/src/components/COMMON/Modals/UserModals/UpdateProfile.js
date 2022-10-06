import React, { useState, useEffect, useContext } from 'react';

import Modal from '../../UIElements/Modal';
import Button from '../../UIElements/Button';
import Input from '../../FormElements/Input';
import ErrorModal from '../MessageModals/ErrorModal';
import LoadingSpinner from '../../UIElements/LoadingSpinner';
import SuccessModal from '../MessageModals/SuccessModal';

import { useForm } from '../../../../hooks/useForm';
import { useHttpClient } from '../../../../hooks/useHttpClient';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_REQUIRE,
} from '../../../../utilities/form-validator';
import { AuthContext } from '../../../../context/auth-context';

import '../../CSS/modals-form.css';
import '../../CSS/modals-layout.css';

const UpdateProfile = (props) => {
  const { token } = useContext(AuthContext);
  const [successMessage, setSuccessMessage] = useState();

  const [formState, inputHandler, setFormData] = useForm(
    {
      alias: { value: '', isValid: true },
      email: { value: '', isValid: true },
      phone: { value: '', isValid: true },
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
            alias: { value: responseData.message.alias, isValid: true },
            email: { value: responseData.message.email, isValid: true },
            phone: { value: responseData.message.phone, isValid: true },
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
          alias: formState.inputs.alias.value,
          email: formState.inputs.email.value,
          phone: formState.inputs.phone.value,
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
                id="alias"
                type="text"
                label="Numele*"
                onInput={inputHandler}
                validators={[VALIDATOR_REQUIRE()]}
                defaultValue={formState.inputs.alias.value}
                defaultValidity={formState.inputs.alias.isValid}
              />
              <Input
                className="input"
                element="input"
                id="email"
                type="email"
                label="Adresa de email*"
                onInput={inputHandler}
                validators={[VALIDATOR_EMAIL()]}
                defaultValue={formState.inputs.email.value}
                defaultValidity={formState.inputs.email.isValid}
              />
              <Input
                className="input"
                element="input"
                id="phone"
                type="phone"
                label="Numarul de contact*"
                onInput={inputHandler}
                validators={[VALIDATOR_REQUIRE()]}
                defaultValue={formState.inputs.phone.value}
                defaultValidity={formState.inputs.phone.isValid}
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

export default UpdateProfile;

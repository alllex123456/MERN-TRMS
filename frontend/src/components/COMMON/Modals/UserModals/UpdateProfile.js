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
import {
  VALIDATOR_EMAIL,
  VALIDATOR_REQUIRE,
} from '../../../../utilities/form-validator';
import { AuthContext } from '../../../../context/auth-context';

import '../../CSS/modals-form.css';
import '../../CSS/modals-layout.css';

const UpdateProfile = (props) => {
  const { token, language, changeContextItem } = useContext(AuthContext);
  const [successMessage, setSuccessMessage] = useState();

  const { t } = useTranslation();

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
          `${process.env.REACT_APP_BACKEND_URL}/user`,
          'GET',
          null,
          { Authorization: 'Bearer ' + token, 'Accept-Language': language }
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
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/user/update`,
        'POST',
        JSON.stringify({
          alias: formState.inputs.alias.value,
          email: formState.inputs.email.value,
          phone: formState.inputs.phone.value,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
          'Accept-Language': language,
        }
      );
      changeContextItem('userAlias', formState.inputs.alias.value);
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

  const header = t('modals.user.personalData.header');

  return (
    <React.Fragment>
      <ErrorModal show={error} onClear={clearError} />
      <SuccessModal success={successMessage} onClear={clearSuccessMessage} />

      {!successMessage && (
        <Modal
          small
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
                  label={t('modals.user.personalData.name')}
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
                  label={t('modals.user.personalData.email')}
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
                  label={t('modals.user.personalData.contact')}
                  onInput={inputHandler}
                  validators={[VALIDATOR_REQUIRE()]}
                  defaultValue={formState.inputs.phone.value}
                  defaultValidity={formState.inputs.phone.isValid}
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

export default UpdateProfile;

import React, { useState, useEffect, useContext } from 'react';
import { CloudArrowDown } from 'phosphor-react';
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

const UpdateLegalData = (props) => {
  const { token, language } = useContext(AuthContext);
  const [successMessage, setSuccessMessage] = useState();

  const { t } = useTranslation();

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
          `${process.env.REACT_APP_BACKEND_URL}/user`,
          'GET',
          null,
          { Authorization: 'Bearer ' + token, 'Accept-Language': language }
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
  }, []);

  const getCompanyData = async () => {
    try {
      const responseData = await sendRequest(
        `https://infocui.ro/system/api/data/?key=92b5c3228259207f49fce773ed9694b0e3f985c8&cui=${formState.inputs.taxNumber.value}`
      );

      setFormData(
        {
          name: { value: responseData.data.nume, isValid: true },
          registeredOffice: {
            value:
              responseData.data.adresa ||
              `${responseData.data.str} nr. ${responseData.data.nr}, localitate ${responseData.data.loc}, județ ${responseData.data.judet}`,
            isValid: true,
          },
          registrationNumber: {
            value: responseData.data.cod_inmatriculare,
            isValid: true,
          },
          taxNumber: { value: responseData.data.cod_fiscal, isValid: true },
          vatPayer: {
            value: responseData.data.tva === 'DA' ? true : false,
            isValid: true,
          },
        },
        false
      );
    } catch (error) {}
  };

  const updateHandler = async (e) => {
    e.preventDefault();
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/user/update`,
        'POST',
        JSON.stringify({
          name: formState.inputs.name.value,
          registeredOffice: formState.inputs.registeredOffice.value,
          registrationNumber: formState.inputs.registrationNumber.value,
          taxNumber: formState.inputs.taxNumber.value,
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

  const header = t('modals.user.professionalData.header');

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
              <div className="formGroup flexColumn">
                <div className="flexRow">
                  <div className="getCompanyData">
                    <Input
                      className="input"
                      element="input"
                      id="taxNumber"
                      type="text"
                      label={t('modals.user.professionalData.taxNumber')}
                      onInput={inputHandler}
                      validators={[VALIDATOR_REQUIRE()]}
                      defaultValue={formState.inputs.taxNumber.value}
                      defaultValidity={formState.inputs.taxNumber.isValid}
                    />
                    <CloudArrowDown
                      className="getCompanyDataBtn"
                      onClick={getCompanyData}
                      size={32}
                    />
                  </div>
                  <Input
                    className="input"
                    element="input"
                    id="registrationNumber"
                    type="text"
                    label={t('modals.user.professionalData.registrationNumber')}
                    onInput={inputHandler}
                    validators={[]}
                    defaultValue={formState.inputs.registrationNumber.value}
                    defaultValidity={
                      formState.inputs.registrationNumber.isValid
                    }
                  />
                </div>

                <Input
                  className="input"
                  element="input"
                  id="name"
                  type="text"
                  label={t('modals.user.professionalData.name')}
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
                  label={t('modals.user.professionalData.registeredOffice')}
                  onInput={inputHandler}
                  validators={[]}
                  defaultValue={formState.inputs.registeredOffice.value}
                  defaultValidity={formState.inputs.registeredOffice.isValid}
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

export default UpdateLegalData;

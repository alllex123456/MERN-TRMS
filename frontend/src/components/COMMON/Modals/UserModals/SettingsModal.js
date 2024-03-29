import React, { useState, useEffect, useRef, useContext } from 'react';
import { FileImage } from 'phosphor-react';
import { useTranslation } from 'react-i18next';

import Button from '../../UIElements/Button';
import Input from '../../FormElements/Input';
import Modal from '../../UIElements/Modal';
import LoadingSpinner from '../../UIElements/LoadingSpinner';
import ErrorModal from '../MessageModals/ErrorModal';
import SuccessModal from '../MessageModals/SuccessModal';

import { useHttpClient } from '../../../../hooks/useHttpClient';
import { useForm } from '../../../../hooks/useForm';
import { AuthContext } from '../../../../context/auth-context';

import '../../CSS/modals-form.css';

const SettingsModal = (props) => {
  const {
    token,
    avatar,
    language,
    languages,
    theme,
    themes,
    userAlias,
    preferredCurrency,
    currencies,
    changeContextItem,
  } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);

  const { t, i18n } = useTranslation();

  const imagePicker = useRef();

  const [formState, inputHandler, setFormData] = useForm(
    {
      avatar: { value: avatar, isValid: true },
      language: {
        value: language || 'EN',
        isValid: true,
      },
      theme: {
        value: theme || 'default',
        isValid: true,
      },
      preferredCurrency: {
        value: preferredCurrency,
        isValid: true,
      },
    },
    true
  );

  const { sendRequest, isLoading, error, clearError } = useHttpClient();

  useEffect(() => {
    const getUserData = async () => {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/user`,
        'GET',
        null,
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
          'Accept-Language': language,
        }
      );
      setUserData(responseData.message);
      setFormData(
        {
          avatar: { value: responseData.message.avatar, isValid: true },
          language: {
            value: responseData.message.language,
            isValid: true,
          },
          theme: {
            value: responseData.message.theme || 'default',
            isValid: true,
          },
          preferredCurrency: {
            value: responseData.message.preferredCurrency,
            isValid: true,
          },
        },
        true
      );
    };

    getUserData();
  }, [sendRequest, setFormData, token, props.show]);

  const getImageInput = () => imagePicker.current.click();

  const imagePickerHandler = (e) => {
    if (e.target.files && e.target.files.length === 1) {
      const pickedImage = e.target.files[0];

      props.setFile(pickedImage);

      setFormData(
        {
          ...formState.inputs,
          avatar: { value: pickedImage, isValid: true },
        },
        true
      );
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('avatar', formState.inputs.avatar.value);
    formData.append('language', formState.inputs.language.value);
    formData.append('theme', formState.inputs.theme.value);
    formData.append(
      'preferredCurrency',
      formState.inputs.preferredCurrency.value
    );

    changeContextItem('language', formState.inputs.language.value);
    changeContextItem(
      'preferredCurrency',
      formState.inputs.preferredCurrency.value
    );
    changeContextItem('theme', formState.inputs.theme.value);

    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/user/update`,
        'POST',
        formData,
        {
          Authorization: 'Bearer ' + token,
          'Accept-Language': formState.inputs.language.value,
        }
      );

      i18n.changeLanguage(formState.inputs.language.value);
      setSuccessMessage(responseData.confirmation);
      props.setShowSettings(false);
      changeContextItem('avatar', responseData.message.filename);
    } catch (error) {}
  };

  const clearSuccessMessage = () => {
    setSuccessMessage(null);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <SuccessModal success={successMessage} onClear={clearSuccessMessage} />
      {!successMessage && (
        <Modal
          small
          className="settingsModal"
          form
          method="POST"
          enctype="multipart/form-data"
          show={props.show}
          close={() => {
            setFormData(
              {
                ...formState.inputs,
                avatar: { value: avatar, isValid: true },
              },
              true
            );
            props.setShowSettings(false);
            props.setPreview(null);
          }}
          header={t('modals.user.settings.header')}
          footer={t('modals.user.settings.accountType')}
          onSubmit={submitHandler}
        >
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="settings">
            <div className="profileAvatar">
              {props.preview || avatar ? (
                <img
                  src={
                    props.preview
                      ? props.preview
                      : `${process.env.REACT_APP_BACKEND_URL}/uploads/avatars/${formState.inputs.avatar.value}`
                  }
                  alt="PROFILE IMAGE"
                />
              ) : (
                <div className="blankAvatar" />
              )}

              <input
                ref={imagePicker}
                type="file"
                id="avatar"
                name="avatar"
                accept=".png, .jpg, .jpeg"
                style={{ display: 'none' }}
                onChange={imagePickerHandler}
              />
              <FileImage
                className="changeProfileAvatar"
                size={48}
                onClick={getImageInput}
              />
              <p>
                <span>{userAlias}</span>
              </p>
            </div>
            <div className="profileSettings">
              <Input
                className="profileInput"
                id="language"
                element="select"
                label={t('modals.user.settings.language')}
                onInput={inputHandler}
                validators={[]}
              >
                <option value={formState.inputs.language.value}>
                  {formState.inputs.language.value}
                </option>
                {languages
                  ?.filter(
                    (language) => language !== formState.inputs.language.value
                  )
                  .map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
              </Input>

              <Input
                className="profileInput"
                id="preferredCurrency"
                element="select"
                label={t('modals.user.settings.currency')}
                onInput={inputHandler}
                validators={[]}
              >
                <option value={formState.inputs.preferredCurrency.value}>
                  {formState.inputs.preferredCurrency.value}
                </option>
                {currencies
                  ?.filter(
                    (currency) =>
                      currency !== formState.inputs.preferredCurrency.value
                  )
                  .map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
              </Input>

              <Input
                className="profileInput"
                id="theme"
                element="select"
                label={t('modals.user.settings.theme')}
                onInput={inputHandler}
                validators={[]}
              >
                <option value={formState.inputs.theme.value}>
                  {formState.inputs.theme.value}
                </option>
                {themes
                  ?.filter((theme) => theme !== formState.inputs.theme.value)
                  .map((theme, index) => (
                    <option key={theme} value={theme}>
                      {theme}
                    </option>
                  ))}
              </Input>
            </div>
          </div>
          <div className="profileActions">
            <Button primary type="submit">
              {t('buttons.saveBtn')}
            </Button>
          </div>
        </Modal>
      )}
    </React.Fragment>
  );
};

export default SettingsModal;

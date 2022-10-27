import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Input from '../COMMON/FormElements/Input';
import Button from '../COMMON/UIElements/Button';
import Card from '../COMMON/UIElements/Card';
import ErrorModal from '../COMMON/Modals/MessageModals/ErrorModal';
import LoadingSpinner from '../COMMON/UIElements/LoadingSpinner';

import { useForm } from '../../hooks/useForm';
import { useHttpClient } from '../../hooks/useHttpClient';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../utilities/form-validator';
import { AuthContext } from '../../context/auth-context';

import styles from './Auth.module.css';

const Auth = () => {
  const navigator = useNavigate();

  const { t, i18n } = useTranslation();

  const [isLoggingIn, setIsLoggingIn] = useState(true);
  const [recoverPassword, setRecoverPassword] = useState(false);
  const [recoverPasswordMessage, setRecoverPasswordMessage] = useState();
  const { login, currencies, languages, language } = useContext(AuthContext);
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false,
      },
      password: {
        value: '',
        isValid: false,
      },
      language: {
        value: '',
        isValid: false,
      },
      preferredCurrency: {
        value: '',
        isValid: false,
      },
      name: {
        value: '',
        isValid: false,
      },
      recoverEmail: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const { sendRequest, isLoading, error, clearError } = useHttpClient();

  const switchModeHandler = () => {
    if (!isLoggingIn) {
      setFormData(
        {
          ...formState.inputs,
          repeatPassword: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          repeatPassword: {
            value: '',
            isValid: false,
          },
          preferredCurrency: {
            value: '',
            isValid: false,
          },
          language: {
            value: '',
            isValid: false,
          },
          name: {
            value: '',
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoggingIn((previousState) => !previousState);
  };

  const authSubmit = async (e) => {
    e.preventDefault();
    if (isLoggingIn) {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/user/login`,
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          { 'Content-Type': 'application/json', 'Accept-Language': language }
        );

        login(responseData.token, responseData.user);

        navigator('/main', { replace: true });
      } catch (error) {}
    } else {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/user/signup`,
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
            name: formState.inputs.name.value,
            language: formState.inputs.language.value,
            preferredCurrency: formState.inputs.preferredCurrency.value,
          }),
          { 'Content-Type': 'application/json', 'Accept-Language': language }
        );

        login(responseData.token, responseData.user);
        i18n.changeLanguage(formState.inputs.language.value);
        navigator('/main', { replace: true });
      } catch (error) {}
    }
  };

  const recoverPasswordHandler = async (e) => {
    e.preventDefault();

    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/user/recover-password`,
        'POST',
        JSON.stringify({ email: formState.inputs.email.value }),
        { 'Content-Type': 'Application/json', 'Accept-Language': language }
      );
      setRecoverPasswordMessage(responseData.message);
    } catch (error) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <div className={styles.authBackground}>
        <Card className={styles.authCard}>
          {isLoading && <LoadingSpinner asOverlay />}
          <h2>{t('auth.authTitle')}</h2>
          <hr />
          <form onSubmit={authSubmit}>
            <Input
              id="email"
              element="input"
              label={t('auth.authEmail')}
              type="text"
              validators={[VALIDATOR_EMAIL()]}
              errorText={t('auth.loginEmailErrorText')}
              onInput={inputHandler}
            />

            <Input
              id="password"
              element="input"
              label={t('auth.authPass')}
              type="password"
              validators={[VALIDATOR_REQUIRE()]}
              errorText={t('auth.loginPasswordErrorText')}
              onInput={inputHandler}
            />

            {!isLoggingIn && (
              <React.Fragment>
                <Input
                  id="repeatPassword"
                  element="input"
                  label={t('auth.repeatPass')}
                  type="password"
                  validators={[VALIDATOR_MINLENGTH(5)]}
                  errorText={t('auth.registerPasswordErrorText')}
                  onInput={inputHandler}
                />
                <Input
                  id="name"
                  element="input"
                  label={t('auth.registerName')}
                  type="text"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText={t('auth.registerNameErrorText')}
                  onInput={inputHandler}
                />
                <Input
                  id="language"
                  element="select"
                  label={t('auth.registerLanguage')}
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText={t('auth.registerLanguageErrorText')}
                  onInput={inputHandler}
                >
                  <option>select...</option>
                  {languages?.map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </Input>
                <Input
                  id="preferredCurrency"
                  element="select"
                  label={t('auth.registerCurrency')}
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText={t('auth.registerCurrencyErrorText')}
                  onInput={inputHandler}
                >
                  <option>select...</option>
                  {currencies?.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </Input>
              </React.Fragment>
            )}
            <div className={styles.authActions}>
              <Button primary onClick={inputHandler}>
                {!isLoggingIn ? t('auth.registerBtn') : t('auth.loginBtn')}
              </Button>
              <Button inverse type="button" onClick={switchModeHandler}>
                {!isLoggingIn ? t('auth.loginBtn') : t('auth.registerBtn')}
              </Button>
            </div>
          </form>

          <button
            className={styles.recoverPasswordBtn}
            onClick={() => setRecoverPassword((prev) => !prev)}
          >
            Recover password
          </button>
          {recoverPassword && (
            <form
              className={styles.recoverPasswordField}
              onSubmit={recoverPasswordHandler}
            >
              <Input
                id="recoverEmail"
                element="input"
                type="text"
                label={t('auth.recoverEmail')}
                validators={[VALIDATOR_EMAIL()]}
                errorText={t('auth.recoverEmailErrorText')}
                onInput={inputHandler}
              />
              <Button secondary type="submit">
                Reset password
              </Button>
              {recoverPasswordMessage && (
                <p className="center">{recoverPasswordMessage}</p>
              )}
            </form>
          )}
        </Card>
      </div>
    </React.Fragment>
  );
};

export default Auth;

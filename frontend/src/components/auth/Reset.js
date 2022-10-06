import React, { useState, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

import ErrorModal from '../COMMON/Modals/MessageModals/ErrorModal';
import LoadingSpinner from '../COMMON/UIElements/LoadingSpinner';
import Card from '../COMMON/UIElements/Card';
import Button from '../COMMON/UIElements/Button';
import Input from '../COMMON/FormElements/Input';

import { useHttpClient } from '../../hooks/useHttpClient';
import { useForm } from '../../hooks/useForm';
import { AuthContext } from '../../context/auth-context';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
} from '../../utilities/form-validator';

import styles from './Auth.module.css';

const Reset = () => {
  const { login } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const navigator = useNavigate();
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const [successMessage, setSuccessMessage] = useState();
  const [errorMessage, setErrorMessage] = useState();

  const { sendRequest, isLoading, error, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      email: { value: email, isValid: true },
      password: { value: '', isValid: false },
      repeatPassword: { value: '', isValid: false },
    },
    false
  );

  const resetPasswordHandler = async (e) => {
    e.preventDefault();

    const { password, repeatPassword } = formState.inputs;

    if (password.value !== repeatPassword.value) {
      setErrorMessage('Cele două parole nu se potrivesc');
    }

    try {
      const responseData = await sendRequest(
        'http://localhost:8000/user/reset-password',
        'POST',
        JSON.stringify({ password: formState.inputs.password.value }),
        { 'Content-Type': 'Application/json', Authorization: 'Bearer ' + token }
      );
      setSuccessMessage(responseData.message);
    } catch (error) {}
  };

  const loginHandler = async (e) => {
    e.preventDefault();

    try {
      const responseData = await sendRequest(
        `http://localhost:8000/user/login`,
        'POST',
        JSON.stringify({
          email: formState.inputs.email.value,
          password: formState.inputs.password.value,
        }),
        { 'Content-Type': 'Application/json' }
      );
      login(
        responseData.token,
        responseData.user._id,
        responseData.user.currencies,
        responseData.user.units,
        responseData.user.avatar
      );
      navigator('/main', { replace: true });
    } catch (error) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <div className={styles.authBackground}>
        <Card className={styles.authCard}>
          {isLoading && <LoadingSpinner asOverlay />}
          <h2>Resetează parola</h2>
          <hr />
          <form onSubmit={successMessage ? loginHandler : resetPasswordHandler}>
            <Input
              disabled
              id="email"
              element="input"
              label="Email"
              type="text"
              placeholder="Adresa de email..."
              validators={[VALIDATOR_EMAIL()]}
              defaultValue={formState.inputs.email.value}
              errorText="Nu s-a introdus o adresă de email validă"
              onInput={inputHandler}
            />
            <Input
              id="password"
              element="input"
              label="Parola"
              type="password"
              placeholder="Parola..."
              validators={[]}
              onInput={inputHandler}
            />

            {!successMessage && (
              <Input
                id="repeatPassword"
                element="input"
                label="Repetă parola"
                type="password"
                placeholder="Parola..."
                validators={[VALIDATOR_MINLENGTH(5)]}
                errorText="Parola trebuie să conțină minim 5 caractere"
                onInput={inputHandler}
              />
            )}
            <Button>{successMessage ? 'Autentificare' : 'Resetare'}</Button>
            {successMessage && <p className="center">{successMessage}</p>}
            {errorMessage && <p className="center">{errorMessage}</p>}
          </form>
        </Card>
      </div>
    </React.Fragment>
  );
};

export default Reset;

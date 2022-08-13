import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import Input from '../UIElements/Input';
import Button from '../UIElements/Button';
import Card from '../UIElements/Card';
import { useForm } from '../../hooks/useForm';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
} from '../../utilities/form-validator';
import { AuthContext } from '../../context/auth-context';

import styles from './Auth.module.css';

const Auth = () => {
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(true);
  const { login } = useContext(AuthContext);
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
    },
    false
  );

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
        },
        false
      );
    }
    setIsLoggingIn((previousState) => !previousState);
  };

  const authSubmit = (e) => {
    e.preventDefault();

    login();
    navigate('/', { replace: true });
  };

  return (
    <div className={styles.authBackground}>
      <Card className={styles.authCard}>
        <h2>Autentificare</h2>
        <hr />
        <form onSubmit={authSubmit}>
          <Input
            id="email"
            element="input"
            label="Email"
            type="text"
            placeholder="Adresa de email..."
            validators={[VALIDATOR_EMAIL()]}
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

          {!isLoggingIn && (
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
          <Button disabled={!formState.isValid} onClick={inputHandler}>
            {!isLoggingIn ? 'CREEAZĂ CONT NOU' : 'AUTENTIFICARE'}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          {!isLoggingIn ? 'AUTENTIFICARE' : 'CREEAZĂ CONT NOU'}
        </Button>
      </Card>
    </div>
  );
};

export default Auth;

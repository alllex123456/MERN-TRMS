import React, { useReducer, useEffect, useContext } from 'react';
import { AuthContext } from '../../../context/auth-context';

import { validator } from '../../../utilities/form-validator';

import styles from './Input.module.css';

const inputReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state,
        value: action.val,
        isValid: validator(action.val, action.validators),
      };

    case 'TOUCHED':
      return {
        ...state,
        isTouched: true,
      };

    default:
      return state;
  }
};

const Input = (props) => {
  const { theme } = useContext(AuthContext);

  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.defaultValue || props.noVal || '',
    isValid: props.defaultValidity || false,
    isTouched: false,
  });

  const inputChangeHandler = (e) => {
    dispatch({
      type: 'CHANGE',
      val: e.target.value,
      validators: props.validators,
    });
    if (props.onSelectClient) props.onSelectClient(e.target.value);
    if (props.onChangeService) props.onChangeService(e.target.value);
  };

  const { id, onInput } = props;
  const { value, isValid } = inputState;
  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, onInput, value, isValid]);

  const touchHandler = () => dispatch({ type: 'TOUCHED' });

  let element;

  if (props.element === 'input') {
    element = (
      <input
        className={`${styles.input} ${props.className} ${
          styles[`${theme}Input`]
        }`}
        id={props.id}
        type={props.type}
        step={props.step ? props.step : null}
        placeholder={props.placeholder}
        value={inputState.value}
        onChange={inputChangeHandler}
        onBlur={touchHandler}
        disabled={props.disabled}
      />
    );
  }
  if (props.element === 'select') {
    element = (
      <select
        className={`${styles.select} ${props.className} ${
          styles[`${theme}Input`]
        }`}
        id={props.id}
        value={inputState.value}
        onChange={inputChangeHandler}
        onBlur={touchHandler}
      >
        {props.children}
      </select>
    );
  }
  if (props.element === 'textarea') {
    element = (
      <textarea
        className={`${styles.textarea} ${props.className} ${
          styles[`${theme}Input`]
        }`}
        id={props.id}
        rows={props.rows || 3}
        value={inputState.value}
        onChange={inputChangeHandler}
        onBlur={touchHandler}
      ></textarea>
    );
  }
  return (
    <div>
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && (
        <p className={styles.error}>{props.errorText}</p>
      )}
    </div>
  );
};

export default Input;

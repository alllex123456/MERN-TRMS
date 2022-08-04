import { useReducer, useCallback } from 'react';

const inputReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE':
      let formIsValid = true;
      for (const input in state.inputs) {
        if (!state.inputs[input]) {
          continue;
        }
        if (input === action.id) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[input].isValid;
        }
      }

      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.id]: {
            value: action.value,
            isValid: action.isValid,
          },
        },
        isValid: formIsValid,
      };

    case 'SET_DATA':
      return {
        inputs: action.value,
        isValid: action.isValid,
      };

    default:
      return state;
  }
};

export const useForm = (initialInputs, initialValidity) => {
  const [formState, dispatch] = useReducer(inputReducer, {
    inputs: initialInputs,
    isValid: initialValidity,
  });

  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({ type: 'CHANGE', id, value, isValid });
  }, []);

  const setFormData = useCallback((value, isValid) => {
    dispatch({ type: 'SET_DATA', value, isValid });
  }, []);

  return [formState, inputHandler, setFormData];
};

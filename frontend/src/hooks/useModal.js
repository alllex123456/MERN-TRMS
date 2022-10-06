import { useCallback, useReducer } from 'react';

const modalReducer = (state, action) => {
  if (action.type === 'CLOSE') {
    return { ...state, show: false };
  } else {
    return {
      type: action.type,
      contents: action.contents,
      show: true,
    };
  }
};

export const useModal = (type, contents, show) => {
  const [modalState, dispatch] = useReducer(modalReducer, {
    type,
    contents,
    show,
  });

  const closeModalHandler = useCallback(() => {
    dispatch({ type: 'CLOSE' });
  }, []);

  const showModalHandler = useCallback((type, contents) => {
    dispatch({ type, contents });
  }, []);

  return { modalState, closeModalHandler, showModalHandler };
};

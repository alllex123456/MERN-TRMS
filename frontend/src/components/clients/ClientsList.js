import React, { useReducer } from 'react';
import ClientItem from './ClientItem';

import styles from './ClientsList.module.css';
import DeleteModal from './modals/DeleteModal';
import EditModal from './modals/EditModal';
import ViewModal from './modals/ViewModal';

const clientReducer = (state, action) => {
  switch (action.type) {
    case 'CLOSE':
      return {
        ...state,
        show: false,
      };
    case 'VIEW':
      return {
        type: action.type,
        show: true,
        content: action.clientData,
      };
    case 'EDIT':
      return {
        type: action.type,
        show: true,
        content: action.clientData,
      };
    case 'DELETE':
      return {
        type: action.type,
        show: true,
        content: action.clientData,
      };
    default:
      return state;
  }
};

const ClientsList = (props) => {
  const [modalState, dispatch] = useReducer(clientReducer, {
    type: '',
    show: false,
    content: '',
  });

  const showModalHandler = (action, clientData) => {
    dispatch({ type: action, clientData });
  };

  const closeModalHandler = () => {
    dispatch({ type: 'CLOSE' });
  };

  return (
    <ul className={styles.clientsList}>
      {modalState.type === 'VIEW' && (
        <ViewModal
          show={modalState.show}
          clientData={modalState.content}
          onCloseModal={closeModalHandler}
        />
      )}
      {modalState.type === 'EDIT' && (
        <EditModal
          show={modalState.show}
          clientData={modalState.content}
          onCloseModal={closeModalHandler}
        />
      )}
      {modalState.type === 'DELETE' && (
        <DeleteModal
          show={modalState.show}
          clientData={modalState.content}
          onCloseModal={closeModalHandler}
        />
      )}

      <h2>Clienți înregistrați la {new Date().toLocaleString()}</h2>

      <span className={styles.head}>NUME</span>
      <span className={styles.head}>TELEFON</span>
      <span className={styles.head}>EMAIL</span>
      <span className={styles.head}>TARIF</span>
      <span className={styles.head}>UM</span>
      <span className={styles.head}>Acțiuni</span>
      {props.clients.map((client, index) => (
        <ClientItem
          key={index}
          clientData={client}
          onShowModal={showModalHandler}
        />
      ))}
    </ul>
  );
};

export default ClientsList;

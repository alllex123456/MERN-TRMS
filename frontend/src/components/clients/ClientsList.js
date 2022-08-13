import React, { useReducer } from 'react';
import { AddressBook } from 'phosphor-react';

import ClientItem from './ClientItem';
import DeleteModal from './modals/DeleteModal';
import EditModal from './modals/EditModal';
import ViewModal from './modals/ViewModal';
import Button from '../UIElements/Button';

import styles from './ClientsList.module.css';
import AddModal from './modals/AddModal';

const clientReducer = (state, action) => {
  switch (action.type) {
    case 'CLOSE':
      return {
        ...state,
        show: false,
      };
    case 'ADD':
      return {
        type: action.type,
        show: true,
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
      {modalState.type === 'ADD' && (
        <AddModal
          show={modalState.show}
          clientData={modalState.content}
          onCloseModal={closeModalHandler}
        />
      )}
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

      <div className={styles.clientsHeader}>
        <AddressBook size={32} className={styles.icon} />
        <h2>Lista clienților înregistrați</h2>
        <Button type="button" onClick={() => showModalHandler('ADD')}>
          + Adaugă client nou
        </Button>
      </div>

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

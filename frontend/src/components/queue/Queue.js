import React, { useReducer } from 'react';
import { Hourglass } from 'phosphor-react';

import OrderItem from './OrderItem';
import AddModal from './modals/AddModal';
import EditModal from './modals/EditModal';
import CompleteModal from './modals/CompleteModal';
import DeleteModal from './modals/DeleteModal';
import Button from '../UIElements/Button';

import styles from './Queue.module.css';
import '../../index.css';

const modalReducer = (state, action) => {
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
    case 'EDIT':
      return {
        type: action.type,
        show: true,
        contents: action.orderData,
      };
    case 'COMPLETE':
      return {
        type: action.type,
        show: true,
        contents: action.orderData,
      };
    case 'DELETE':
      return {
        type: action.type,
        show: true,
        contents: action.orderData,
      };

    default:
      return state;
  }
};

export const Queue = (props) => {
  const [modalState, dispatch] = useReducer(modalReducer, {
    type: '',
    show: false,
    contents: {},
  });

  const closeModalHandler = (type) => {
    dispatch({ type: 'CLOSE' });
  };

  const showModalHandler = (action, orderData) => {
    dispatch({ type: action, orderData });
  };

  if (props.orders.length === 0) {
    return <h3>Nu există comenzi în așteptare</h3>;
  }

  return (
    <ul className={styles.queueList}>
      {modalState.type === 'ADD' && (
        <AddModal
          orderData={modalState.contents}
          show={modalState.show}
          onCloseModal={closeModalHandler}
        />
      )}
      {modalState.type === 'EDIT' && (
        <EditModal
          orderData={modalState.contents}
          show={modalState.show}
          onCloseModal={closeModalHandler}
        />
      )}

      {modalState.type === 'COMPLETE' && (
        <CompleteModal
          orderData={modalState.contents}
          show={modalState.show}
          onCloseModal={closeModalHandler}
        />
      )}

      {modalState.type === 'DELETE' && (
        <DeleteModal
          orderData={modalState.contents}
          show={modalState.show}
          onCloseModal={closeModalHandler}
        />
      )}

      <div className={styles.queueHeader}>
        <Hourglass size={32} className={styles.icon} />
        <h2>Organizator lucrări in curs</h2>
        <Button type="button" onClick={() => showModalHandler('ADD')}>
          + Adaugă comandă nouă
        </Button>
      </div>
      <li className={styles.queueItem}>
        <span className={styles.orderItemNo}>Nr. crt.</span>
        <span className={styles.orderItemRef}>Referință</span>
        <span className={styles.orderItemClient}>Client</span>
        <span className={styles.orderItemReceived}>Data primirii</span>
        <span className={styles.orderItemDeadline}>Termen</span>
        <span className={styles.orderItemCount}>Volum estimat</span>
        <span className={styles.orderItemRate}>Tarif</span>
        <span className={styles.orderItemNotes}>Note</span>
        <span className={styles.orderItemActions}>Acțiuni</span>
      </li>
      {props.orders.map((order, index) => (
        <OrderItem
          key={index + 1}
          itno={index + 1}
          orderData={order}
          onShowModal={showModalHandler}
          onCloseModal={closeModalHandler}
        />
      ))}
    </ul>
  );
};

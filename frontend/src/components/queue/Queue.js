import React, { useState, useRef } from 'react';
import { Hourglass } from 'phosphor-react';

import { OrderItem } from './OrderItem';

import styles from './Queue.module.css';
import '../../index.css';
import { Modal } from './Modal';
import Button from '../UIElements/Button';

export const Queue = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [modalContents, setModalContents] = useState();

  // modal refs
  const clientRef = useRef();
  const receivedRef = useRef();
  const deadlineRef = useRef();
  const rateRef = useRef();
  const countRef = useRef();
  const notesRef = useRef();

  const hideModalHandler = () => {
    setShowModal(false);
  };

  const showModalHandler = (mode, orderData) => {
    setShowModal(true);
    if (mode === 'complete') {
      setModalContents(
        <Modal
          complete
          orderData={orderData}
          clientRef={clientRef}
          receivedRef={receivedRef}
          deadlineRef={deadlineRef}
          rateRef={rateRef}
          countRef={countRef}
          notesRef={notesRef}
          onHideModal={hideModalHandler}
        />
      );
    }
    if (mode === 'edit') {
      setModalContents(
        <Modal
          edit
          orderData={orderData}
          clientRef={clientRef}
          receivedRef={receivedRef}
          deadlineRef={deadlineRef}
          rateRef={rateRef}
          countRef={countRef}
          notesRef={notesRef}
          onHideModal={hideModalHandler}
        />
      );
    }
    if (mode === 'delete') {
      setModalContents(
        <Modal
          delete
          orderData={orderData}
          clientRef={clientRef}
          receivedRef={receivedRef}
          deadlineRef={deadlineRef}
          rateRef={rateRef}
          countRef={countRef}
          notesRef={notesRef}
          onHideModal={hideModalHandler}
        />
      );
    }
  };

  const addOrderHandler = () => {};

  if (props.orders.length === 0) {
    return <h3>Nu există comenzi în așteptare</h3>;
  }

  return (
    <ul className={styles.queueList}>
      {showModal && modalContents}
      <div className={styles.queueHeader}>
        <Hourglass size={32} className={styles.icon} />
        <h2>Organizator lucrări in curs</h2>
        <Button type="button" onClick={addOrderHandler}>
          + Adaugă comandă nouă
        </Button>
      </div>
      <li className={styles.queueItem}>
        <span className={styles.orderItemNo}>Nr. crt.</span>
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
          itno={index + 1}
          orderData={order}
          onShowModal={showModalHandler}
          onHideModal={hideModalHandler}
        />
      ))}
    </ul>
  );
};

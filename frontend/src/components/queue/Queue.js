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
  const editClientRef = useRef();
  const editReceivedRef = useRef();
  const editDeadlineRef = useRef();
  const editRateRef = useRef();
  const editCountRef = useRef();
  const editNotesRef = useRef();

  const hideModalHandler = () => {
    setShowModal(false);
  };

  const showModalHandler = (mode, orderData) => {
    setShowModal(true);
    if (mode === 'editing') {
      setModalContents(
        <Modal onHideModal={hideModalHandler}>
          <div className={styles.formGroup}>
            <label htmlFor="editClient">Client:</label>
            <select id="editClient" ref={editClientRef}>
              <option defaultValue={orderData.client}>
                {orderData.client}
              </option>
              <option>CLIENT</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="editReceived">Data primirii:</label>
            <input
              id="editReceived"
              type="datetime"
              defaultValue={orderData.received}
              ref={editReceivedRef}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="editDeadline">Termen:</label>
            <input
              id="editDeadline"
              type="datetime"
              defaultValue={orderData.deadline}
              ref={editDeadlineRef}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="editRate">Tarif:</label>
            <input
              id="editRate"
              type="number"
              step="0.01"
              defaultValue={orderData.rate}
              ref={editRateRef}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="editCount">Volum estimat:</label>
            <input
              id="editCount"
              type="number"
              step="0.01"
              defaultValue={orderData.count}
              ref={editCountRef}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="editNotes">Note:</label>
            <textarea
              id="editNotes"
              defaultValue={orderData.notes}
              ref={editNotesRef}
            />
          </div>
        </Modal>
      );
    }
    if (mode === 'delete') {
      setModalContents(<Modal onHideModal={hideModalHandler}>DELETE</Modal>);
    }
    if (mode === 'complete') {
      setModalContents(<Modal onHideModal={hideModalHandler}>COMPLETE</Modal>);
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

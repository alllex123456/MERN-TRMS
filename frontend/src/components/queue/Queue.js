import React, { useState, useRef } from 'react';
import { Hourglass } from 'phosphor-react';

import { OrderItem } from './OrderItem';

import styles from './Queue.module.css';
import '../../index.css';
import { Modal } from './Modal';

export const Queue = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [modalContents, setModalContents] = useState();

  // modal refs
  const editClientRef = useRef();

  const hideModalHandler = () => {
    setShowModal(false);
  };

  const showModalHandler = (mode, orderData) => {
    setShowModal(true);
    if (mode === 'editing') {
      setModalContents(
        <Modal onHideModal={hideModalHandler}>
          <select ref={editClientRef}>
            <option defaultValue={orderData.client}>{orderData.client}</option>
            <option>CLIENT</option>
          </select>
          <input type="number" step="0.01" defaultValue={orderData.rate} />
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

  if (props.orders.length === 0) {
    return <h3>Nu exista comenzi in asteptare</h3>;
  }

  return (
    <ul className={styles.queueList}>
      {showModal && modalContents}
      <div className={styles.queueHeader}>
        <Hourglass size={32} className={styles.icon} />
        <h2 className="marbo-l">Organizator lucrari in curs</h2>
      </div>
      <li className={styles.queueItem}>
        <span className={styles.orderItemNo}>Nr. crt.</span>
        <span className={styles.orderItemClient}>Client</span>
        <span className={styles.orderItemCount}>Volum estimat</span>
        <span className={styles.orderItemRate}>Tarif</span>
        <span className={styles.orderItemDeadline}>Termen</span>
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

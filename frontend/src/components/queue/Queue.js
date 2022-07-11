import React from 'react';
import { Hourglass } from 'phosphor-react';

import { OrderItem } from './OrderItem';

import styles from './Queue.module.css';
import '../../index.css';

export const Queue = (props) => {
  if (props.orders.length === 0) {
    return <h3>Nu exista comenzi in asteptare</h3>;
  }

  return (
    <ul className={styles.queueList}>
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
        <OrderItem itno={index + 1} orderData={order} />
      ))}
    </ul>
  );
};

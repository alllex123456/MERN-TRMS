import React from 'react';
import { PencilSimple, Trash, Flag } from 'phosphor-react';

import styles from './OrderItem.module.css';

const OrderItem = ({ itno, orderData, onShowModal }) => {
  return (
    <li className={styles.orderItem}>
      <span className={styles.orderItemNo}>{itno}</span>
      <span className={styles.orderItemRef}>{orderData.orderRef}</span>
      <span className={styles.orderItemClient}>{orderData.client}</span>
      <span className={styles.orderItemReceived}>{orderData.received}</span>
      <span className={styles.orderItemDeadline}>{orderData.deadline}</span>
      <span className={styles.orderItemCount}>
        {orderData.count.toLocaleString()}
      </span>
      <span className={styles.orderItemRate}>{orderData.rate}</span>
      <span className={styles.orderItemNotes}>{orderData.notes}</span>
      <span className={styles.orderItemActions}>
        <Flag
          onClick={() => onShowModal('COMPLETE', orderData)}
          className={styles.orderItemIcon}
          size={24}
        />
        <PencilSimple
          onClick={() => onShowModal('EDIT', orderData)}
          className={styles.orderItemIcon}
          size={24}
        />
        <Trash
          onClick={() => onShowModal('DELETE', orderData)}
          className={styles.orderItemIcon}
          size={24}
        />
      </span>
    </li>
  );
};

export default OrderItem;
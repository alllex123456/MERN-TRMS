import React from 'react';
import { PencilSimple, Trash, Flag } from 'phosphor-react';

import styles from './OrderItem.module.css';

const OrderItem = ({ itno, orderData, onShowModal }) => {
  return (
    <li className={styles.orderItem}>
      <span className={styles.orderItemNo}>
        <span className={styles.responsive}>Nr.</span>
        {itno}
      </span>
      <span className={styles.orderItemRef}>
        <span className={styles.responsive}>Referinta</span>
        {orderData.orderRef}
      </span>
      <span className={styles.orderItemClient}>
        <span className={styles.responsive}>Client</span>
        {orderData.client}
      </span>
      <span className={styles.orderItemReceived}>
        <span className={styles.responsive}>Data primirii</span>
        {orderData.received}
      </span>
      <span className={styles.orderItemDeadline}>
        <span className={styles.responsive}>Termen</span>
        {orderData.deadline}
      </span>
      <span className={styles.orderItemCount}>
        <pspan className={styles.responsive}>Volum estimat</pspan>
        {orderData.count.toLocaleString()}
      </span>
      <span className={styles.orderItemRate}>
        <span className={styles.responsive}>Tarif</span>
        {orderData.rate}
      </span>
      <span className={styles.orderItemNotes}>
        <span className={styles.responsive}>Note</span>
        {orderData.notes}
      </span>
      <span className={styles.orderItemActions}>
        <span className={styles.responsive}>Actiuni</span>
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

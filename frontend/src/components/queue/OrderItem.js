import React, { useState } from 'react';
import { PencilSimple, Trash, Flag } from 'phosphor-react';

import { Modal } from './Modal';

import styles from './OrderItem.module.css';

export const OrderItem = ({ itno, orderData, onShowModal, onHideModal }) => {
  return (
    <li className={styles.orderItem}>
      <span className={styles.orderItemNo}>{itno}</span>
      <span className={styles.orderItemClient}>{orderData.client}</span>
      <span className={styles.orderItemCount}>
        {orderData.count.toLocaleString()}
      </span>
      <span className={styles.orderItemRate}>{orderData.rate}</span>
      <span className={styles.orderItemDeadline}>{orderData.deadline}</span>
      <span className={styles.orderItemNotes}>{orderData.notes}</span>
      <span className={styles.orderItemActions}>
        <PencilSimple
          onClick={() => onShowModal('editing', orderData)}
          className={styles.orderItemIcon}
          size={24}
        />
        <Trash
          onClick={() => onShowModal('delete')}
          className={styles.orderItemIcon}
          size={24}
        />
        <Flag
          onClick={() => onShowModal('complete')}
          className={styles.orderItemIcon}
          size={24}
        />
      </span>
    </li>
  );
};

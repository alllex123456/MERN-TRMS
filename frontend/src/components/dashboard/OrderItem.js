import React, { useContext } from 'react';
import { format } from 'date-fns';

import { AuthContext } from '../../context/auth-context';

import styles from './OrderItem.module.css';

const OrderItem = ({ order }) => {
  const { theme } = useContext(AuthContext);
  return (
    <li className={`${styles.orderItem} ${styles[`${theme}OrderItem`]}`}>
      <h4>
        <span>Client:</span> {order.clientId.name}
      </h4>
      <p>
        <span>Termen:</span>{' '}
        {format(new Date(order.deadline), 'dd.LL.yyyy hh:mm')}
      </p>
      <p>
        <span>Volum estimat:</span> {order.count.toLocaleString()}
      </p>
    </li>
  );
};

export default OrderItem;

import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { AuthContext } from '../../context/auth-context';

import styles from './OrderItem.module.css';

const OrderItem = ({ order }) => {
  const { theme, language } = useContext(AuthContext);
  const { t } = useTranslation();

  return (
    <li className={`${styles.orderItem} ${styles[`${theme}OrderItem`]}`}>
      <h4>
        <span>{t('orders.client')}</span> {order.clientId.name}
      </h4>
      <p>
        <span>{t('orders.deadline')}</span>{' '}
        {new Date(order.deadline).toLocaleString(language)}
      </p>
      <p>
        <span>{t('orders.estimatedCount')}</span> {order.count.toLocaleString()}
      </p>
    </li>
  );
};

export default OrderItem;

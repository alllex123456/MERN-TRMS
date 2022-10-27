import React, { useContext } from 'react';

import { useTranslation } from 'react-i18next';

import { AuthContext } from '../../context/auth-context';

import styles from './OrderItem.module.css';

const InvoiceItem = (props) => {
  const { theme, language } = useContext(AuthContext);
  const { t } = useTranslation();

  return (
    <li className={`${styles.orderItem} ${styles[`${theme}OrderItem`]}`}>
      <h4>
        <span>{t('orders.client')}</span> {props.invoice.clientId.name}
      </h4>
      <p>
        <span>{t('invoicing.invoice.maturity')}</span>{' '}
        {new Date(props.invoice.dueDate).toLocaleDateString(language)}
      </p>
      <p>
        <span>{t('invoicing.invoice.value')}</span>{' '}
        {props.invoice.totalInvoice.toLocaleString(language, {
          style: 'currency',
          currency: props.invoice.clientId.currency,
        })}
      </p>
    </li>
  );
};

export default InvoiceItem;

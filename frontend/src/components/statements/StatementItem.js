import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { formatCurrency } from '../../utilities/format-currency';
import { AuthContext } from '../../context/auth-context';

import styles from './StatementItem.module.css';

const StatementItem = ({ data }) => {
  const { language, theme } = useContext(AuthContext);
  const navigator = useNavigate();

  const { t } = useTranslation();

  const totalDue = (orders) => {
    const total = orders?.reduce((acc, order) => acc + order.total, 0);
    return Math.round(total);
  };

  return (
    <li
      className={`${styles.statementItem} ${styles[`${theme}StatementItem`]}`}
      onClick={() => navigator(`${data.id}`, { replace: false })}
    >
      <h2 className={styles.name}>{data.name}</h2>
      <p className={styles.clientDue}>
        {formatCurrency(language, data.currency, totalDue(data.orders))}
      </p>
      <p className={styles.invoiced}>
        {t('statements.lastInvoicing')}:{' '}
        {new Date().toLocaleDateString(language)}
      </p>
    </li>
  );
};

export default StatementItem;

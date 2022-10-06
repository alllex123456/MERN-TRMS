import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import format from 'date-fns/format';

import styles from './StatementItem.module.css';
import { formatCurrency } from '../../utilities/format-currency';
import { AuthContext } from '../../context/auth-context';

const StatementItem = ({ data }) => {
  const { language } = useContext(AuthContext);
  const navigator = useNavigate();

  const totalDue = (orders) => {
    const total = orders?.reduce((acc, order) => acc + order.total, 0);
    return Math.round(total);
  };

  return (
    <li
      className={styles.statementItem}
      onClick={() => navigator(`${data.id}`, { replace: false })}
    >
      <h2 className={styles.name}>{data.name}</h2>
      <p className={styles.clientDue}>
        {formatCurrency(language, data.currency, totalDue(data.orders))}
      </p>
      <p className={styles.invoiced}>
        Ultima factură emisă la: {format(new Date(), 'dd.mm.yyyy')}
      </p>
    </li>
  );
};

export default StatementItem;

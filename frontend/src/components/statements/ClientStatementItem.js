import React, { useContext } from 'react';
import { PencilSimple, Trash } from 'phosphor-react';
import { useTranslation } from 'react-i18next';

import { getReadableUnit } from '../../utilities/get-units';
import { AuthContext } from '../../context/auth-context';
import { formatCurrency } from '../../utilities/format-currency';
import { translateServices } from '../../utilities/translate-units';

import styles from './ClientStatementItem.module.css';

const ClientStatementItem = ({ client, order, index, onShowModal }) => {
  const { units, language, theme } = useContext(AuthContext);

  const { t } = useTranslation();

  return (
    <React.Fragment>
      <li className={`${styles.orderItem} ${styles[`${theme}OrderItem`]}`}>
        <section className={styles.section}>
          <div className={styles.orderNo}>
            <p>{index + 1}</p>
          </div>
          <div className={styles.orderReference}>
            <div className={styles.orderServiceType}>
              {translateServices([order.service]).displayedValue}
            </div>
            <span>
              {t('orders.reference')}: {order.reference}
            </span>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.orderReceived}>
            <span>{t('orders.receivedDate')}:</span>
            <p>{new Date(order.receivedDate).toLocaleDateString()}</p>
          </div>
          <div className={styles.orderDelivered}>
            <span>{t('orders.deliveredDate')}:</span>
            <p>{new Date(order.deliveredDate).toLocaleDateString()}</p>
          </div>
          <div className={styles.orderDeadline}>
            <span>{t('orders.deadline')}:</span>
            <p>{new Date(order.deadline).toLocaleDateString()}</p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.orderCount}>
            <span>{t('invoicing.invoice.qty')}:</span>
            <p>{Number(order.count).toLocaleString()}</p>
          </div>
          <div className={styles.orderRate}>
            <span>{t('orders.rate')}:</span>
            <p>
              {Number(order.rate).toLocaleString()}/
              {getReadableUnit(units, order.unit)}
            </p>
          </div>
          <div className={styles.orderTotal}>
            <span>{t('orders.total')}:</span>
            <p>
              {formatCurrency(
                language,
                order.currency,
                order.total,
                client.decimalPoints
              )}
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.orderNotes}>
            <span>{t('orders.notes')}:</span>
            <p>{order.notes}</p>
          </div>
        </section>

        <div className={styles.orderActions}>
          <PencilSimple
            onClick={() => onShowModal('EDIT', order.id)}
            className={styles.orderItemIcon}
            size={24}
          />
          <Trash
            onClick={() => onShowModal('DELETE', order)}
            className={styles.orderItemIcon}
            size={24}
          />
        </div>
      </li>
    </React.Fragment>
  );
};

export default ClientStatementItem;

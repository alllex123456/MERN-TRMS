import React, { useState, useEffect, useContext } from 'react';
import { PencilSimple, Trash, Flag } from 'phosphor-react';

import { AuthContext } from '../../context/auth-context';
import { getReadableUnit } from '../../utilities/get-units';
import { formatCurrency } from '../../utilities/format-currency';
import { translateServices } from '../../utilities/translate-units';

import styles from './OrderItem.module.css';

const OrderItem = ({ itno, orderData, onShowModal }) => {
  const { language, units } = useContext(AuthContext);
  const [time, setTime] = useState(new Date());
  const [exceededDeadline, setExceededDeadline] = useState();
  const [nearDeadline, setNearDeadline] = useState();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 60000);

    setExceededDeadline(
      new Date(orderData.deadline).getTime() < new Date(time).getTime()
    );

    setNearDeadline(
      new Date(orderData.deadline).getTime() <
        new Date(time).getTime() + 3600000
    );

    return () => clearInterval(timer);
  }, [orderData.deadline, time]);

  return (
    <li
      className={` ${exceededDeadline && styles.exceeded} ${
        nearDeadline && styles.urgent
      } ${!exceededDeadline && !nearDeadline && styles.orderItemBackground} ${
        styles.orderItem
      } `}
    >
      <section className={styles.section}>
        <div className={styles.orderService}>
          <div className={styles.orderServiceType}>
            {translateServices([orderData.service]).displayedValue}
          </div>
          <div className={styles.orderItemRef}>
            <span>Referință </span>
            <span>{orderData.reference}</span>
          </div>
        </div>
        <div className={styles.orderHeading}>
          <div className={styles.orderItemNo}>
            <div>{itno}</div>
            <div className={styles.clientPhotoContainer}>
              {orderData.clientId.avatar ? (
                <img
                  src={
                    `http://localhost:8000/uploads/avatars/${orderData.clientId.avatar}` ||
                    './images/avatar.jpg'
                  }
                  alt=""
                />
              ) : (
                <div className="blankAvatar" />
              )}
            </div>
          </div>

          <div className={styles.orderItemClient}>
            <span>Client</span>
            <p>{orderData.clientId.name}</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.orderItemReceived}>
          <span>Data primirii</span>
          <p>
            {new Date(orderData.receivedDate).toLocaleString('ro').slice(0, 17)}
          </p>
        </div>
        <div className={styles.orderItemDeadline}>
          <span>Termen</span>
          <p>
            {new Date(orderData.deadline).toLocaleString('ro').slice(0, 17)}
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.orderItemCount}>
          <span>Volum estimat</span>
          <p>{orderData.count.toLocaleString('ro')}</p>
        </div>
        <div className={styles.orderItemRate}>
          <span>Tarif</span>
          <p>
            {formatCurrency(language, orderData.currency, orderData.rate)}/
            {getReadableUnit(units, orderData.unit)}
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.orderItemNotes}>
          <span>Note</span>
          <p>{orderData.notes}</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.orderItemActions}>
          <Flag
            onClick={() => onShowModal('COMPLETE', orderData.id)}
            className={styles.orderItemIcon}
            size={24}
          />
          <PencilSimple
            onClick={() => onShowModal('EDIT', orderData.id)}
            className={styles.orderItemIcon}
            size={24}
          />
          <Trash
            onClick={() => onShowModal('DELETE', orderData)}
            className={styles.orderItemIcon}
            size={24}
          />
        </div>
      </section>
    </li>
  );
};

export default OrderItem;

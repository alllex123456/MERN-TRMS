import React, { useState, useEffect, useContext } from 'react';

import LoadingSpinner from '../COMMON/UIElements/LoadingSpinner';
import ErrorModal from '../COMMON/Modals/MessageModals/ErrorModal';
import OrderItem from './OrderItem';
import Notes from './Notes';
import Activity from './Activity';
import Invoices from './Invoices';

import { AuthContext } from '../../context/auth-context';
import { useHttpClient } from '../../hooks/useHttpClient';

import styles from './Dashboard.module.css';
import { format } from 'date-fns';

const Main = () => {
  const { token, theme } = useContext(AuthContext);
  const [loadedOrders, setLoadedOrders] = useState([]);

  const { sendRequest, isLoading, error, clearError } = useHttpClient();

  useEffect(() => {
    const getPendingOrders = async () => {
      const responseData = await sendRequest(
        `http://localhost:8000/orders/get-pending`,
        'GET',
        null,
        { Authorization: 'Bearer ' + token }
      );
      setLoadedOrders(
        responseData.message.filter(
          (order) =>
            format(new Date(order.deadline), 'dd/LL/yyyy') ===
            format(new Date(), 'dd/LL/yyy')
        )
      );
    };
    getPendingOrders();
  }, [sendRequest, token]);

  return (
    <React.Fragment>
      <ErrorModal show={error} onClear={clearError} />
      <main className={`${styles.dashboard} pageContainer`}>
        <section className={styles.dashboardOrders}>
          {isLoading && <LoadingSpinner asOverlay />}
          <h2>Comenzi de predat astăzi</h2>
          <ul className={styles.dashboardOrdersList}>
            {loadedOrders.length === 0 && (
              <li className={`center noItems ${theme}NoItems`}>
                Nu sunt comenzi de predat astazi
              </li>
            )}
            {!isLoading &&
              loadedOrders &&
              loadedOrders.map((order) => (
                <OrderItem key={order.id} order={order} />
              ))}
          </ul>
        </section>
        <section className={styles.dashboardNotes}>
          <h2>Notițe</h2>
          <Notes />
        </section>
        <section className={styles.dashboardCharts}>
          <h2>Activitate</h2>
          <Activity />
        </section>
        <section className={styles.dashboardInvoices}>
          <h2>Facturi</h2>
          <Invoices />
        </section>
      </main>
    </React.Fragment>
  );
};

export default Main;

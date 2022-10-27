import React, { useState, useEffect, useContext } from 'react';
import { isToday } from 'date-fns';
import { useTranslation } from 'react-i18next';

import LoadingSpinner from '../COMMON/UIElements/LoadingSpinner';
import ErrorModal from '../COMMON/Modals/MessageModals/ErrorModal';
import OrderItem from './OrderItem';
import Notes from './Notes';
import Activity from './Activity';
import InvoiceItem from './InvoiceItem';

import { AuthContext } from '../../context/auth-context';
import { useHttpClient } from '../../hooks/useHttpClient';

import styles from './Dashboard.module.css';

const Main = () => {
  const { token, theme, language } = useContext(AuthContext);
  const [loadedOrders, setLoadedOrders] = useState([]);
  const [loadedInvoices, setLoadedInvoices] = useState([]);

  const { t } = useTranslation();

  const { sendRequest, isLoading, error, clearError } = useHttpClient();

  useEffect(() => {
    const getPendingOrders = async () => {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/orders/get-pending`,
        'GET',
        null,
        { Authorization: 'Bearer ' + token, 'Accept-Language': language }
      );
      setLoadedOrders(
        responseData.message.filter((order) =>
          isToday(new Date(order.deadline))
        )
      );
    };
    getPendingOrders();
  }, [sendRequest, token]);

  useEffect(() => {
    const getInvoices = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/invoicing`,
          'GET',
          null,
          { Authorization: 'Bearer ' + token, 'Accept-Language': language }
        );
        setLoadedInvoices(responseData.invoicesOnly);
      } catch (error) {}
    };
    getInvoices();
  }, [sendRequest, token, language]);

  return (
    <React.Fragment>
      <ErrorModal show={error} onClear={clearError} />
      <main className={`${styles.dashboard} pageContainer`}>
        <section className={styles.dashboardOrders}>
          {isLoading && <LoadingSpinner asOverlay />}
          <h2>{t('dashboard.ordersToday')}</h2>
          <ul className={styles.dashboardOrdersList}>
            {loadedOrders.length === 0 && (
              <li className={`center noItems ${theme}NoItems`}>
                {t('dashboard.noOrders')}
              </li>
            )}
            {!isLoading &&
              loadedOrders &&
              loadedOrders.map((order) => (
                <OrderItem key={order.id} order={order} />
              ))}
          </ul>
        </section>
        <section className={styles.dashboardInvoices}>
          {isLoading && <LoadingSpinner asOverlay />}
          <h2>{t('dashboard.invoicesThisWeek')}</h2>
          <ul className={styles.dashboardInvoiceList}>
            {loadedInvoices.length === 0 && (
              <li className={`center noItems ${theme}NoItems`}>
                {t('dashboard.noInvoices')}
              </li>
            )}
            {!isLoading &&
              loadedInvoices &&
              loadedInvoices.map((invoice) => (
                <InvoiceItem key={invoice._id} invoice={invoice} />
              ))}
          </ul>
        </section>
        <section className={styles.dashboardNotes}>
          <h2>{t('dashboard.notes')}</h2>
          <Notes />
        </section>
        <section className={styles.dashboardCharts}>
          <h2>{t('dashboard.activity')}</h2>
          <Activity />
        </section>
      </main>
    </React.Fragment>
  );
};

export default Main;

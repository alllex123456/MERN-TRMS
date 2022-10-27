import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Money } from 'phosphor-react';
import { useTranslation } from 'react-i18next';

import LoadingSpinner from '../COMMON/UIElements/LoadingSpinner';
import ClientSummary from './ClientSummary';
import ErrorModal from '../COMMON/Modals/MessageModals/ErrorModal';

import { useHttpClient } from '../../hooks/useHttpClient';
import { AuthContext } from '../../context/auth-context';

import styles from './Invoices.module.css';
import { formatISO, sub } from 'date-fns';

const Invoices = () => {
  const { token, theme, language } = useContext(AuthContext);

  const [searchQuery, setSearchQuery] = useState();
  const [userClients, setUserClients] = useState([]);
  const [invoiceStatus, setInvoiceStatus] = useState('all');
  const [filterFrom, setFilterFrom] = useState(
    formatISO(sub(new Date(), { months: 3 }))
  );
  const [filterTo, setFilterTo] = useState(formatISO(new Date()));

  const { t } = useTranslation();

  const { sendRequest, isLoading, error, clearError } = useHttpClient();

  const getUserClients = useCallback(async () => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/clients`,
        'GET',
        null,
        { Authorization: 'Bearer ' + token, 'Accept-Language': language }
      );
      setUserClients(responseData.message.clients);
    } catch (error) {}
  }, [sendRequest]);

  useEffect(() => {
    getUserClients();
  }, [getUserClients]);

  const searchClientHandler = (e) => {
    setSearchQuery(e.target.value);
  };

  const resetSearchHandler = (e) => {
    if (e.key !== 'Escape') return;
    setSearchQuery(null);
    e.target.value = '';
  };

  const filterInvoicesHandler = (e) => {
    setInvoiceStatus(e.target.value);
  };

  const changeDateFromHandler = (e) => {
    const dateChanged = new Date(
      `${+e.target.value.slice(0, 4)}, ${+e.target.value.slice(5, 7)}, ${
        +e.target.value.slice(8, 10) + 1
      }`
    );
    setFilterFrom(dateChanged.toISOString());
  };
  const changeDateToHandler = (e) => {
    const dateChanged = new Date(
      `${+e.target.value.slice(0, 4)}, ${+e.target.value.slice(5, 7)}, ${
        +e.target.value.slice(8, 10) + 1
      }`
    );
    setFilterTo(dateChanged.toISOString());
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />

      <div className="pageContainer">
        <div className={styles.invoicesHeader}>
          <Money size={32} />
          <h2>{t('invoicing.title')}</h2>
        </div>

        <div className={styles.flex}>
          {isLoading && <LoadingSpinner className="center" />}
          {!isLoading && userClients && (
            <ul className={styles.invoiceList}>
              <div className={styles.invoiceFilters}>
                <input
                  className={`${styles.input} ${styles[`${theme}Input`]}`}
                  type="text"
                  placeholder={t('invoicing.searchPlaceholder')}
                  onChange={searchClientHandler}
                  onKeyDown={resetSearchHandler}
                />

                <select
                  className={`${styles.select} ${styles[`${theme}Select`]}`}
                  onChange={filterInvoicesHandler}
                >
                  <option value="all">{t('invoicing.invFilter')}</option>
                  <option value="issued">{t('invoicing.statusIssued')}</option>
                  <option value="cashed">{t('invoicing.statusCashed')}</option>
                  <option value="delayed">
                    {t('invoicing.statusDelayed')}
                  </option>
                </select>

                <div className={styles.dates}>
                  <span>{t('invoicing.period')}: </span>
                  <input
                    className={`${styles.input} ${styles[`${theme}Input`]}`}
                    type="date"
                    value={filterFrom.slice(0, 10)}
                    onChange={changeDateFromHandler}
                  />
                  <span> - </span>
                  <input
                    className={`${styles.input} ${styles[`${theme}Input`]}`}
                    type="date"
                    value={filterTo.slice(0, 10)}
                    onChange={changeDateToHandler}
                  />
                </div>
              </div>
              {userClients.length === 0 && (
                <li className={`center noItems ${theme}NoItems`}>
                  {t('statements.noResults')}
                </li>
              )}
              {userClients
                .filter((client) => {
                  if (!searchQuery) return client.name;
                  return client.name
                    ?.toLowerCase()
                    .includes(searchQuery?.toLowerCase());
                })
                .map((client, index) => (
                  <ClientSummary
                    key={index}
                    invoiceStatus={invoiceStatus}
                    client={client}
                    onChange={getUserClients}
                    dateFrom={filterFrom}
                    dateTo={filterTo}
                  />
                ))}
            </ul>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Invoices;

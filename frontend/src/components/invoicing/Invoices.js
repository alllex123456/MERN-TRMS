import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Money } from 'phosphor-react';

import LoadingSpinner from '../COMMON/UIElements/LoadingSpinner';
import ClientSummary from './ClientSummary';
import ErrorModal from '../COMMON/Modals/MessageModals/ErrorModal';

import { useHttpClient } from '../../hooks/useHttpClient';
import { AuthContext } from '../../context/auth-context';

import styles from './Invoices.module.css';
import { formatISO, sub } from 'date-fns';

const Invoices = () => {
  const { token } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState();
  const [userClients, setUserClients] = useState([]);
  const [invoiceStatus, setInvoiceStatus] = useState('all');
  const [filterFrom, setFilterFrom] = useState(
    formatISO(sub(new Date(), { months: 3 }))
  );
  const [filterTo, setFilterTo] = useState(formatISO(new Date()));

  const { sendRequest, isLoading, error, clearError } = useHttpClient();

  const getUserClients = useCallback(async () => {
    try {
      const responseData = await sendRequest(
        `http://localhost:8000/clients`,
        'GET',
        null,
        { Authorization: 'Bearer ' + token }
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
          <h2>Facturi clienți</h2>
        </div>

        <div className={styles.flex}>
          {isLoading && <LoadingSpinner className="center" />}
          {!isLoading && userClients && (
            <ul className={styles.invoiceList}>
              <div className={styles.invoiceFilters}>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="caută după nume client..."
                  onChange={searchClientHandler}
                  onKeyDown={resetSearchHandler}
                />

                <select
                  className={styles.select}
                  onChange={filterInvoicesHandler}
                >
                  <option value="all">Toate</option>
                  <option value="issued">Emise</option>
                  <option value="cashed">Incasate</option>
                  <option value="delayed">Restante</option>
                </select>

                <div className={styles.dates}>
                  <span>Perioada: </span>
                  <input
                    className={styles.input}
                    type="date"
                    value={filterFrom.slice(0, 10)}
                    onChange={changeDateFromHandler}
                  />
                  <span> - </span>
                  <input
                    className={styles.input}
                    type="date"
                    value={filterTo.slice(0, 10)}
                    onChange={changeDateToHandler}
                  />
                </div>
              </div>
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

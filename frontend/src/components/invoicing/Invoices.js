import React, { useState, useEffect, useContext } from 'react';

import { BookOpen, Money } from 'phosphor-react';

import ErrorModal from '../COMMON/Modals/MessageModals/ErrorModal';

import { useHttpClient } from '../../hooks/useHttpClient';
import { AuthContext } from '../../context/auth-context';

import styles from './Invoices.module.css';
import LoadingSpinner from '../COMMON/UIElements/LoadingSpinner';
import ClientSummary from './ClientSummary';

const Invoices = () => {
  const { token } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState();
  const [user, setUser] = useState();

  const { sendRequest, isLoading, error, clearError } = useHttpClient();

  useEffect(() => {
    const getAllInvoices = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:8000/invoicing`,
          'GET',
          null,
          { Authorization: 'Bearer ' + token }
        );
        setUser(responseData.message);
      } catch (error) {}
    };
    getAllInvoices();
  }, [token, sendRequest]);

  const searchClientHandler = (e) => {
    setSearchQuery(e.target.value);
  };

  const resetSearchHandler = (e) => {
    if (e.key !== 'Escape') return;
    setSearchQuery(null);
    e.target.value = '';
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />

      <div className="pageContainer">
        <div className={styles.statementsHeader}>
          <Money size={32} />
          <h2>Facturi clienți</h2>
        </div>

        <div className={styles.flex}>
          {isLoading && <LoadingSpinner className="center" />}
          {!isLoading && user && (
            <ul className={styles.statementList}>
              <input
                className={styles.input}
                type="text"
                placeholder="caută după nume client..."
                onChange={searchClientHandler}
                onKeyDown={resetSearchHandler}
              />
              {user.clients
                .filter((client) => {
                  if (!searchQuery) return client.name;
                  return client.name
                    ?.toLowerCase()
                    .includes(searchQuery?.toLowerCase());
                })
                .map((client, index) => (
                  <ClientSummary key={index} client={client} />
                ))}
            </ul>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Invoices;

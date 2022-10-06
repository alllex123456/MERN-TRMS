import React, { useState, useEffect, useContext } from 'react';

import { BookOpen } from 'phosphor-react';

import StatementItem from './StatementItem';
import ErrorModal from '../COMMON/Modals/MessageModals/ErrorModal';

import { useHttpClient } from '../../hooks/useHttpClient';
import { AuthContext } from '../../context/auth-context';

import styles from './AllStatements.module.css';
import LoadingSpinner from '../COMMON/UIElements/LoadingSpinner';

const AllStatements = () => {
  const { token } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState();
  const [loadedData, setLoadedData] = useState();
  const [selectedData, setSelectedData] = useState();

  const { sendRequest, isLoading, error, clearError } = useHttpClient();

  useEffect(() => {
    const getStatementData = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:8000/statements`,
          'GET',
          null,
          { Authorization: 'Bearer ' + token }
        );
        setLoadedData(responseData.message);
      } catch (error) {}
    };
    getStatementData();
  }, [token, sendRequest]);

  let positiveBalance = [];
  let negativeBalance = [];

  if (loadedData) {
    loadedData.forEach((client) => {
      const total = client?.orders.reduce((acc, order) => acc + order.total, 0);
      if (total > 0) positiveBalance.push(client);
      if (total < 0) negativeBalance.push(client);
    });
  }

  const switchStatementView = (e) => {
    setSelectedData(e.target.value);
  };

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
          <BookOpen size={32} />
          <h2>Situații clienți</h2>
          <select
            className={styles.select}
            label="Tip sold"
            onChange={switchStatementView}
          >
            <option className={styles.option} value="all">
              Toti clienții
            </option>
            <option className={styles.option} value="positive">
              Cu sold pozitiv
            </option>
            <option className={styles.option} value="negative">
              Cu sold negativ
            </option>
          </select>
        </div>

        <div className={styles.flex}>
          {isLoading && <LoadingSpinner className="center" />}
          {!isLoading && loadedData && (
            <ul className={styles.statementList}>
              <input
                className={styles.input}
                type="text"
                placeholder="caută după nume client..."
                onChange={searchClientHandler}
                onKeyDown={resetSearchHandler}
              />
              {loadedData.length === 0 && (
                <li className="center noItems">Nu există rezultate</li>
              )}
              {selectedData === 'positive' &&
                positiveBalance
                  .filter((data) => {
                    if (!searchQuery) return data;
                    return data.name
                      ?.toLowerCase()
                      .includes(searchQuery?.toLowerCase());
                  })
                  .map((data, index) => (
                    <StatementItem key={index} data={data} />
                  ))}
              {selectedData !== 'positive' &&
                selectedData !== 'negative' &&
                loadedData
                  .filter((data) => {
                    if (!searchQuery) return data;
                    return data.name
                      ?.toLowerCase()
                      .includes(searchQuery?.toLowerCase());
                  })
                  .map((data, index) => (
                    <StatementItem key={index} data={data} />
                  ))}
              {selectedData === 'negative' &&
                negativeBalance
                  .filter((data) => {
                    if (!searchQuery) return data;
                    return data.name
                      ?.toLowerCase()
                      .includes(searchQuery?.toLowerCase());
                  })
                  .map((data, index) => (
                    <StatementItem key={index} data={data} />
                  ))}
            </ul>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default AllStatements;

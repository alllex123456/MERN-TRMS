import React, { useState, useEffect, useContext } from 'react';
import { BookOpen } from 'phosphor-react';
import { useTranslation } from 'react-i18next';

import StatementItem from './StatementItem';
import ErrorModal from '../COMMON/Modals/MessageModals/ErrorModal';
import LoadingSpinner from '../COMMON/UIElements/LoadingSpinner';

import { useHttpClient } from '../../hooks/useHttpClient';
import { AuthContext } from '../../context/auth-context';

import styles from './AllStatements.module.css';

const AllStatements = () => {
  const { token, theme, language } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState();
  const [loadedData, setLoadedData] = useState();
  const [selectedData, setSelectedData] = useState();

  const { t } = useTranslation();

  const { sendRequest, isLoading, error, clearError } = useHttpClient();

  useEffect(() => {
    const getStatementData = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/statements`,
          'GET',
          null,
          { Authorization: 'Bearer ' + token, 'Accept-Language': language }
        );
        setLoadedData(responseData.message);
      } catch (error) {}
    };
    getStatementData();
  }, [token, sendRequest, language]);

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
          <h2>{t('statements.title')}</h2>
          <select
            className={`${styles.select} ${styles[`${theme}Select`]}`}
            onChange={switchStatementView}
          >
            <option className={styles.option} value="all">
              {t('statements.filterAll')}
            </option>
            <option className={styles.option} value="positive">
              {t('statements.filterPositiveBalance')}
            </option>
            <option className={styles.option} value="negative">
              {t('statements.filterNegativeBalance')}
            </option>
          </select>
        </div>

        <div className={styles.flex}>
          {isLoading && <LoadingSpinner className="center" />}
          {!isLoading && loadedData && (
            <ul className={styles.statementList}>
              <input
                className={`${styles.input} ${styles[`${theme}Input`]}`}
                type="text"
                placeholder={t('statements.searchPlaceholder')}
                onChange={searchClientHandler}
                onKeyDown={resetSearchHandler}
              />
              {loadedData.length === 0 && (
                <li className={`center noItems ${theme}NoItems`}>
                  {t('statements.noResults')}
                </li>
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

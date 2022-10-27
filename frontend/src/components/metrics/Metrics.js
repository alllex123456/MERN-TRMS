import React, { useState, useEffect, useContext } from 'react';
import { Activity } from 'phosphor-react';
import { isToday, isThisWeek, isThisMonth } from 'date-fns';
import { useTranslation } from 'react-i18next';

import ErrorModal from '../COMMON/Modals/MessageModals/ErrorModal';

import { useHttpClient } from '../../hooks/useHttpClient';
import { AuthContext } from '../../context/auth-context';
import { formatCurrency } from '../../utilities/format-currency';
import {
  getIntervalMetrics,
  getMonths,
  getUnitMetrics,
} from '../../utilities/calculate-metrics';

import styles from './Metrics.module.css';
import BarChart from '../COMMON/Charts/BarChart';
import LoadingSpinner from '../COMMON/UIElements/LoadingSpinner';

const Metrics = () => {
  const { token, language, preferredCurrency, theme } = useContext(AuthContext);
  const [loadedData, setLoadedData] = useState({
    pendingOrders: [],
    completedOrders: [],
  });
  const [currencies, setCurrencies] = useState([]);

  const { t } = useTranslation();

  const todayMetrics = getUnitMetrics(isToday, loadedData.completedOrders);
  const thisWeekMetrics = getUnitMetrics(
    isThisWeek,
    loadedData.completedOrders
  );
  const thisMonthMetrics = getUnitMetrics(
    isThisMonth,
    loadedData.completedOrders
  );

  const last7days = getIntervalMetrics(6, loadedData.completedOrders);
  const chartLast7Days = {
    labels: [],
    datasets: [
      {
        label: [preferredCurrency],
        data: [],
        color:
          (theme === 'light' && 'rgba(53, 162, 235, 0.8)') ||
          (theme === 'dark' && 'rgba(53, 162, 235, 0.8)') ||
          (theme === 'default' && 'rgb(53, 162, 235)'),
        borderColor:
          (theme === 'light' && 'rgb(53, 162, 235)') ||
          (theme === 'dark' && 'rgb(53, 162, 235)') ||
          (theme === 'default' && 'rgb(53, 162, 235)'),
        backgroundColor:
          (theme === 'light' && 'rgb(53, 162, 235)') ||
          (theme === 'dark' && 'rgba(53, 162, 235, 0.4)') ||
          (theme === 'default' && 'rgb(53, 162, 235)'),
      },
    ],
  };
  for (const [key, value] of Object.entries(last7days)) {
    if (value[preferredCurrency]) chartLast7Days.labels.push(key);

    for (const [subkey, subvalue] of Object.entries(value)) {
      if (subkey === preferredCurrency) {
        chartLast7Days.datasets[0].data.push(subvalue);
      }
    }
  }
  chartLast7Days.labels.sort((a, b) => a.slice(0, 2) - b.slice(0, 2));

  const monthMetrics = getMonths(loadedData.completedOrders, preferredCurrency);
  const chartMonths = {
    labels: [],
    datasets: [
      {
        label: preferredCurrency,
        data: [],
        color:
          (theme === 'light' && 'rgba(53, 162, 235, 0.8)') ||
          (theme === 'dark' && 'rgba(53, 162, 235, 0.8)') ||
          (theme === 'default' && 'rgb(53, 162, 235)'),
        borderColor:
          (theme === 'light' && 'rgb(53, 162, 235)') ||
          (theme === 'dark' && 'rgb(53, 162, 235)') ||
          (theme === 'default' && 'rgb(53, 162, 235)'),
        backgroundColor:
          (theme === 'light' && 'rgb(53, 162, 235)') ||
          (theme === 'dark' && 'rgba(53, 162, 235, 0.4)') ||
          (theme === 'default' && 'rgb(53, 162, 235)'),
      },
    ],
  };
  for (const [key, value] of Object.entries(monthMetrics)) {
    chartMonths.labels.push(key);
    chartMonths.datasets[0].data.push(value);
  }

  const monthChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: t('charts.monthlyLabel'),
      },
    },
  };

  const dayChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: t('charts.per7DaysLabel'),
      },
    },
  };

  const { sendRequest, isLoading, error, clearError } = useHttpClient();

  useEffect(() => {
    const getMetrics = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/metrics`,
          'GET',
          null,
          { Authorization: 'Bearer ' + token, 'Accept-Language': language }
        );
        setLoadedData({
          pendingOrders: responseData.pendingOrders,
          completedOrders: responseData.completedOrders,
        });
      } catch (error) {}
    };
    const getCurrencies = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/app/app-settings`,
          'GET',
          null,
          { Authorization: 'Bearer ' + token, 'Accept-Language': language }
        );
        setCurrencies(responseData.message.currencies);
      } catch (error) {}
    };
    getMetrics();
    getCurrencies();
  }, [token, sendRequest, language]);

  return (
    <div className="pageContainer">
      <ErrorModal show={error} onClearError={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <div className="pageContainer">
        <header className={styles.metricsHeader}>
          <Activity size={32} className={styles.icon} />
          <h2>{t('metrics.title')}</h2>
        </header>
        <main className={styles.chartMetrics}>
          <div className={styles.chart}>
            <BarChart
              className={styles.chart}
              chartData={chartLast7Days}
              options={dayChartOptions}
            />
          </div>
          <div className={styles.chart}>
            <BarChart
              className={styles.chart}
              chartData={chartMonths}
              options={monthChartOptions}
            />
          </div>
        </main>
        <aside className={styles.numberMetrics}>
          <div className={styles.numberMetricsGroup}>
            <h4>{t('metrics.today')}</h4>
            {currencies.map((currency) => {
              if (todayMetrics[currency])
                return (
                  <p key={currency}>
                    {formatCurrency(language, currency, todayMetrics[currency])}
                  </p>
                );
            })}
          </div>
          <div className={styles.numberMetricsGroup}>
            <h4>{t('metrics.currentWeek')}</h4>
            {currencies.map((currency) => {
              if (thisWeekMetrics[currency])
                return (
                  <p key={currency}>
                    {formatCurrency(
                      language,
                      currency,
                      thisWeekMetrics[currency]
                    )}
                  </p>
                );
            })}
          </div>
          <div className={styles.numberMetricsGroup}>
            <h4>{t('metrics.currentMonth')}</h4>
            {currencies.map((currency) => {
              if (thisMonthMetrics[currency])
                return (
                  <p key={currency}>
                    {formatCurrency(
                      language,
                      currency,
                      thisMonthMetrics[currency]
                    )}
                  </p>
                );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Metrics;

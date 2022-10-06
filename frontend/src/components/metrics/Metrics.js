import React, { useState, useEffect, useContext } from 'react';
import { Activity } from 'phosphor-react';
import {
  isToday,
  isThisWeek,
  isThisMonth,
  format,
  startOfYear,
} from 'date-fns';

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

const Metrics = () => {
  const { token, language, preferredCurrency } = useContext(AuthContext);
  const [loadedData, setLoadedData] = useState({
    pendingOrders: [],
    completedOrders: [],
  });
  const [currencies, setCurrencies] = useState([]);

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
        backgroundColor: 'rgba(0, 0, 100, 0.2)',
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
        backgroundColor: 'rgba(0, 0, 150, 0.2)',
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
        text: 'Venituri lunare',
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
        text: 'Venituri pe ultimele 7 zile',
      },
    },
  };

  const { sendRequest, isLoading, error, clearError } = useHttpClient();

  useEffect(() => {
    const getMetrics = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:8000/metrics`,
          'GET',
          null,
          { Authorization: 'Bearer ' + token }
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
          `http://localhost:8000/app/app-settings`,
          'GET',
          null,
          { Authorization: 'Bearer ' + token }
        );
        setCurrencies(responseData.message.currencies);
      } catch (error) {}
    };
    getMetrics();
    getCurrencies();
  }, [token, sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal show={error} onClearError={clearError} />

      <div className="pageContainer">
        <header className={styles.metricsHeader}>
          <Activity size={32} className={styles.icon} />
          <h2>Date de lucru</h2>
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
            <h4>Astăzi</h4>
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
            <h4>Săptămâna curentă</h4>
            {currencies.map((currency) => {
              if (thisWeekMetrics[currency])
                return (
                  <p>
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
            <h4>Luna curentă</h4>
            {currencies.map((currency) => {
              if (thisMonthMetrics[currency])
                return (
                  <p>
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
    </React.Fragment>
  );
};

export default Metrics;

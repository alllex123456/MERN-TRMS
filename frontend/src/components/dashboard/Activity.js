import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import ErrorModal from '../COMMON/Modals/MessageModals/ErrorModal';
import LoadingSpinner from '../COMMON/UIElements/LoadingSpinner';

import { AreaChart } from '../COMMON/Charts/AreaChart';
import { getIntervalMetrics } from '../../utilities/calculate-metrics';
import { AuthContext } from '../../context/auth-context';
import { useHttpClient } from '../../hooks/useHttpClient';

import styles from './Activity.module.css';

const Activity = () => {
  const { token, theme, language } = useContext(AuthContext);
  const [loadedOrders, setLoadedOrders] = useState([]);

  const { t } = useTranslation();

  const { sendRequest, isLoading, error, clearError } = useHttpClient();

  useEffect(() => {
    const getOrders = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/metrics`,
          'GET',
          null,
          { Authorization: 'Bearer ' + token, 'Accept-Language': language }
        );

        setLoadedOrders(responseData.completedOrders);
      } catch (error) {}
    };
    getOrders();
  }, [sendRequest, token]);

  const ordersLastMonth = getIntervalMetrics(30, loadedOrders);
  const pagesArray = [];
  for (const [key, value] of Object.entries(ordersLastMonth)) {
    if (value['2000cw/s']) {
      pagesArray.push(value['2000cw/s'] / 2000);
    }
    if (value['300w']) {
      pagesArray.push(value['300w'] / 300);
    }
    if (value['word']) {
      pagesArray.push(value['word'] / 300);
    }
    if (value['1800cw/os']) {
      pagesArray.push(value['1800cw/s'] / 1800);
    }
  }
  const chartDays = {
    labels: [],
    datasets: [
      {
        fill: true,
        label: t('charts.pages'),
        data: [],
        color:
          (theme === 'light' && 'rgba(53, 162, 235, 0.8)') ||
          (theme === 'dark' && 'rgba(53, 162, 235, 0.8)') ||
          (theme === 'default' && 'rgba(53, 162, 235, 0.8)'),
        borderColor:
          (theme === 'light' && 'rgba(53, 162, 235)') ||
          (theme === 'dark' && 'rgba(53, 162, 235)') ||
          (theme === 'default' && 'rgba(53, 162, 235)'),
        backgroundColor:
          (theme === 'light' && 'rgba(53, 162, 235, 0.4)') ||
          (theme === 'dark' && 'rgba(53, 162, 235, 0.4)') ||
          (theme === 'default' && 'rgba(53, 162, 235, 0.4)'),
      },
    ],
  };
  let pass = -1;
  for (const [key, value] of Object.entries(ordersLastMonth)) {
    pass++;
    chartDays.labels.push(key);
    if (value['2000cw/s']) {
      chartDays.datasets[0].data[pass] = value['2000cw/s'] / 2000;
    }
    if (value['300w']) {
      chartDays.datasets[0].data[pass] =
        chartDays.datasets[0].data[pass] + value['300w'] / 300;
    }
    if (value['word']) {
      chartDays.datasets[0].data[pass] =
        chartDays.datasets[0].data[pass] + value['word'] / 300;
    }
    if (value['1800cw/os']) {
      chartDays.datasets[0].data[pass] =
        chartDays.datasets[0].data[pass] + value['1800cw/s'] / 1800;
    }
  }
  chartDays.labels.sort((a, b) => a.slice(0, 2) - b.slice(0, 2));
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: t('charts.thisMonthLabel'),
      },
    },
  };

  return (
    <React.Fragment>
      <ErrorModal show={error} onClear={clearError} />
      <div className={styles.activity}>
        {isLoading && <LoadingSpinner asOverlay />}
        <AreaChart chartOptions={chartOptions} chartData={chartDays} />
      </div>
    </React.Fragment>
  );
};

export default Activity;

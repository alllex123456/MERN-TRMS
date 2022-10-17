import React, { useState, useEffect, useContext } from 'react';
import { isThisMonth } from 'date-fns';

import { AreaChart } from '../COMMON/Charts/AreaChart';
import {
  getIntervalMetrics,
  getUnitMetrics,
} from '../../utilities/calculate-metrics';
import { AuthContext } from '../../context/auth-context';

import styles from './Activity.module.css';
import { useHttpClient } from '../../hooks/useHttpClient';
import ErrorModal from '../COMMON/Modals/MessageModals/ErrorModal';
import LoadingSpinner from '../COMMON/UIElements/LoadingSpinner';

const Activity = () => {
  const { token, theme } = useContext(AuthContext);
  const [loadedOrders, setLoadedOrders] = useState([]);

  const { sendRequest, isLoading, error, clearError } = useHttpClient();

  useEffect(() => {
    const getOrders = async () => {
      try {
        const responseData = await sendRequest(
          'http://localhost:8000/metrics',
          'GET',
          null,
          { Authorization: 'Bearer ' + token }
        );

        setLoadedOrders(responseData.completedOrders);
      } catch (error) {}
    };
    getOrders();
  }, [sendRequest, token]);
  console.log(loadedOrders);
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
        label: 'Pagini',
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
        text: 'Lucrari finalizate in luna curenta',
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

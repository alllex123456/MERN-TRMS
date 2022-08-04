import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Grafic de activitate pe luni',
      font: {
        size: 80,
      },
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

const winnings = [12800, 19600, 8400, 16400, 11500, 9100, 26800];

export const data = {
  labels,
  datasets: [
    {
      label: 'Câștiguri',
      data: winnings.map((value) => [0, value]),
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

function BarVertical() {
  return (
    <Bar
      style={{ width: '40rem', height: '25rem' }}
      options={options}
      data={data}
    />
  );
}

export default BarVertical;

import React from 'react';
import { Queue } from '../components/queue/Queue';

export const QueuePage = () => {
  const ORDERS_PENDING = [
    {
      id: '1',
      client: 'Test Client 1',
      count: 5000,
      rate: 10,
      deadline: new Date().toLocaleString(),
      notes: 'notes',
    },
  ];

  return <Queue orders={ORDERS_PENDING} />;
};

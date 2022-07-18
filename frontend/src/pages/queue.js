import React from 'react';
import { Queue } from '../components/queue/Queue';

export const QueuePage = () => {
  const ORDERS_PENDING = [
    {
      id: '1',
      client: 'Test Client 1',
      received: new Date().toLocaleString(),
      deadline: new Date().toLocaleString(),
      count: 5000,
      rate: 10,
      notes: 'notes',
    },
    {
      id: '2',
      client: 'Test Client 2',
      received: new Date().toLocaleString(),
      deadline: new Date().toLocaleString(),
      count: 250000,
      rate: 12,
      notes: 'other notes',
    },
  ];

  return <Queue orders={ORDERS_PENDING} />;
};

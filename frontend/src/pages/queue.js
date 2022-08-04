import React from 'react';
import { Queue } from '../components/queue/Queue';

export const QueuePage = () => {
  const ORDERS_PENDING = [
    {
      client: 'Test Client 1',
      orderRef: 'referinta comanda',
      received: new Date().toLocaleString().slice(0, 17),
      deadline: new Date().toLocaleString().slice(0, 17),
      count: 5000,
      rate: 10,
      notes: 'notes',
    },
    {
      client: 'Test Client 2',
      orderRef: 'referinta comanda',
      received: new Date().toLocaleString().slice(0, 17),
      deadline: new Date().toLocaleString().slice(0, 17),
      count: 250000,
      rate: 12,
      notes: 'other notes',
    },
  ];

  return <Queue orders={ORDERS_PENDING} />;
};

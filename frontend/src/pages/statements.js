import React from 'react';
import AllStatements from '../components/statements/AllStatements';

export const StatementsPage = () => {
  const STATEMENTS = [
    {
      clientId: 'c1',
      client: 'Test Client 1',
      orderRef: 'referinta comanda',
      received: new Date().toLocaleString().slice(0, 17),
      deadline: new Date().toLocaleString().slice(0, 17),
      delivered: new Date().toLocaleString().slice(0, 17),
      count: 5000,
      rate: 10,
      notes: 'notes',
    },
    {
      clientId: 'c2',
      client: 'Test Client 2',
      orderRef: 'referinta comanda',
      received: new Date().toLocaleString().slice(0, 17),
      deadline: new Date().toLocaleString().slice(0, 17),
      delivered: new Date().toLocaleString().slice(0, 17),
      count: 250000,
      rate: 12,
      notes: 'other notes',
    },
  ];
  return <AllStatements statements={STATEMENTS} />;
};

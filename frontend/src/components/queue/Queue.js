import React from 'react';
import { OrderItem } from './OrderItem';

export const Queue = (props) => {
  if (props.orders.length === 0) {
    return <h3>Nu exista comenzi in asteptare</h3>;
  }

  return (
    <ul>
      {props.orders.map((order, index) => (
        <OrderItem itno={index + 1} orderData={order} />
      ))}
    </ul>
  );
};

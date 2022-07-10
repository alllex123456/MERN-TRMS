import React from 'react';

export const OrderItem = ({ itno, orderData }) => {
  return (
    <li>
      <span>{itno}</span>
      <span>{orderData.client}</span>
      <span>{orderData.count}</span>
      <span>{orderData.rate}</span>
      <span>{orderData.deadline}</span>
      <span>{orderData.notes}</span>
    </li>
  );
};

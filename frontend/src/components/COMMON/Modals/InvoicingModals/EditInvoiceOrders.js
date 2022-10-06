import React, { useState, useContext } from 'react';
import { CheckCircle, PencilSimple, Trash } from 'phosphor-react';

import { AuthContext } from '../../../../context/auth-context';

const CALCULATE_TOTALS = (unit, count, rate) => {
  let total;
  if (unit === '2000cw/s') {
    total = (count / 2000) * rate;
  }
  if (unit === 'word') {
    total = count * rate;
  }
  if (unit === '300w') {
    total = (count / 300) * rate;
  }
  if (unit === '1800cw/os') {
    total = (count / 1800) * rate;
  }
  return total;
};

const EditInvoiceOrders = ({ order, onUpdateOrders, totalInvoiceTouched }) => {
  const { language } = useContext(AuthContext);
  const [editMode, setEditMode] = useState(false);

  const [referenceValue, setReferenceValue] = useState(
    `${order.service}/${order.reference}`
  );
  const [rateValue, setRateValue] = useState(order.rate);
  const [countValue, setCountValue] = useState(order.count);

  const [orderTotal, setOrderTotal] = useState(
    CALCULATE_TOTALS(order.unit, countValue, rateValue)
  );

  const confirmChangeHandler = () => {
    setEditMode(false);
  };

  return (
    <tr key={order.id}>
      <td>
        {editMode ? (
          <input
            value={referenceValue}
            onChange={(e) => {
              setReferenceValue(e.target.value);
              onUpdateOrders('edit', {
                orderId: order.id,
                reference: e.target.value,
                count: countValue,
                rate: rateValue,
                total: CALCULATE_TOTALS(order.unit, countValue, rateValue),
              });
            }}
          />
        ) : (
          `${order.service}/${order.reference}`
        )}
      </td>
      <td>
        {new Date(order.receivedDate).toLocaleDateString(language)}/
        {new Date(order.deliveredDate).toLocaleDateString(language)}
      </td>
      <td>
        {editMode ? (
          <input
            type="number"
            step="0.01"
            value={countValue}
            onChange={(e) => {
              setCountValue(+e.target.value);
              setOrderTotal(
                CALCULATE_TOTALS(order.unit, +e.target.value, rateValue)
              );
              onUpdateOrders('edit', {
                orderId: order.id,
                reference: referenceValue,
                count: +e.target.value,
                rate: rateValue,
                total: CALCULATE_TOTALS(order.unit, +e.target.value, rateValue),
              });
            }}
          />
        ) : (
          order.count.toLocaleString(language)
        )}
      </td>
      <td>
        {editMode ? (
          <input
            type="number"
            step="0.01"
            value={rateValue}
            onChange={(e) => {
              setRateValue(+e.target.value);
              setOrderTotal(
                CALCULATE_TOTALS(order.unit, countValue, +e.target.value)
              );
              onUpdateOrders('edit', {
                orderId: order.id,
                reference: referenceValue,
                count: countValue,
                rate: +e.target.value,
                total: CALCULATE_TOTALS(
                  order.unit,
                  countValue,
                  +e.target.value
                ),
              });
            }}
          />
        ) : (
          order.rate.toLocaleString(language, {
            style: 'currency',
            currency: order.currency,
          })
        )}
      </td>
      <td>
        {orderTotal.toLocaleString(language, {
          style: 'currency',
          currency: order.currency,
        })}
      </td>
      <td>
        {editMode ? (
          <CheckCircle
            size={24}
            style={{ cursor: 'pointer' }}
            onClick={confirmChangeHandler}
          />
        ) : (
          <React.Fragment>
            {!totalInvoiceTouched && (
              <PencilSimple
                size={24}
                style={{ cursor: 'pointer' }}
                onClick={() => setEditMode(true)}
              />
            )}
            {!totalInvoiceTouched && (
              <Trash
                size={24}
                style={{ cursor: 'pointer' }}
                onClick={() => onUpdateOrders('delete', { orderId: order.id })}
              />
            )}
          </React.Fragment>
        )}
      </td>
    </tr>
  );
};

export default EditInvoiceOrders;

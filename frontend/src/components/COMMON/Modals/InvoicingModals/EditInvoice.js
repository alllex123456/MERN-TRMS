import React, { useState, useEffect, useContext } from 'react';
import ErrorModal from '../MessageModals/ErrorModal';
import SuccessModal from '../MessageModals/SuccessModal';
import Modal from '../../UIElements/Modal';
import Input from '../../FormElements/Input';
import Button from '../../UIElements/Button';
import LoadingSpinner from '../../UIElements/LoadingSpinner';

import { useHttpClient } from '../../../../hooks/useHttpClient';
import { useForm } from '../../../../hooks/useForm';
import { AuthContext } from '../../../../context/auth-context';

import '../../CSS/modals-form.css';
import '../../CSS/modals-layout.css';
import '../../CSS/table.css';

import EditInvoiceOrders from './EditInvoiceOrders';

const EditInvoice = (props) => {
  const { token, language } = useContext(AuthContext);
  const [successMessage, setSuccessMessage] = useState();
  const [invoiceOrders, setInvoiceOrders] = useState([]);
  const [ordersEdited, setOrdersEdited] = useState([]);
  const [ordersDeleted, setOrdersDeleted] = useState([]);
  const [totalInvoiceTouched, setTotalInvoiceTouched] = useState(false);

  const [totalInvoice, setTotalInvoice] = useState(
    props.invoiceData.invoice.totalInvoice
  );
  const [remainder, setRemainder] = useState(
    props.invoiceData.invoice.remainder
  );

  const { series, number, dueDate, issuedDate, orders } =
    props.invoiceData.invoice;
  const { name, currency } = props.invoiceData.client;

  const { sendRequest, error, clearError, isLoading } = useHttpClient();

  const [formState, inputHandler] = useForm(
    {
      issuedDate: { value: issuedDate, isValid: true },
      dueDate: { value: dueDate, isValid: true },
    },

    true
  );

  useEffect(() => {
    const getOrders = async () => {
      try {
        const responseData = await sendRequest(
          'http://localhost:8000/orders',
          'GET',
          null,
          { Authorization: 'Bearer ' + token, Payload: JSON.stringify(orders) }
        );
        setInvoiceOrders(responseData.message);
      } catch (error) {}
    };
    getOrders();
  }, [sendRequest, orders, token]);

  const updateOrders = (type, { orderId, reference, count, rate, total }) => {
    if (type === 'edit') {
      const index = invoiceOrders.findIndex((order) => order.id === orderId);
      invoiceOrders[index].reference = reference;
      invoiceOrders[index].count = count;
      invoiceOrders[index].rate = rate;
      invoiceOrders[index].total = total;

      setTotalInvoice(
        invoiceOrders.reduce((acc, val) => (acc += val.total), 0)
      );

      for (const order of ordersEdited) {
        if (order._id === orderId) {
          order.reference = reference;
          order.count = count;
          order.rate = rate;
          order.total = total;
          return;
        }
      }
      setOrdersEdited((prev) => [...prev, invoiceOrders[index]]);
    }

    if (type === 'delete') {
      const index = invoiceOrders.findIndex((order) => order.id === orderId);
      setOrdersDeleted((prev) => [...prev, invoiceOrders[index]]);
      setInvoiceOrders((prev) => prev.filter((order) => orderId !== order.id));
      setTotalInvoice(
        invoiceOrders
          .filter((order) => orderId !== order.id)
          .reduce((acc, val) => (acc += val.total), 0)
      );
    }
  };

  const undoChanges = async () => {
    try {
      const responseData = await sendRequest(
        'http://localhost:8000/orders',
        'GET',
        null,
        { Authorization: 'Bearer ' + token, Payload: JSON.stringify(orders) }
      );
      setInvoiceOrders(responseData.message);
    } catch (error) {}

    try {
      const responseData = await sendRequest(
        `http://localhost:8000/invoicing/${props.invoiceData.invoice._id}`,
        'GET',
        null,
        { Authorization: 'Bearer ' + token }
      );
      setTotalInvoice(responseData.message.totalInvoice);
      setRemainder(responseData.message.remainder);
      setTotalInvoiceTouched(false);
    } catch (error) {}
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const responseData = await sendRequest(
        'http://localhost:8000/invoicing/modify-invoice',
        'PATCH',
        JSON.stringify({
          invoiceId: props.invoiceData.invoice._id,
          clientId: props.invoiceData.client._id,
          issuedDate: formState.inputs.issuedDate.value,
          dueDate: formState.inputs.dueDate.value,
          ordersEdited,
          ordersDeleted,
          totalInvoice,
          remainder,
        }),
        { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }
      );
      setSuccessMessage(responseData.message);
      props.onRefresh();
    } catch (error) {}
  };

  const closeModalHandler = () => {
    props.onCloseModal();
    props.onUpdate();
    undoChanges();
  };

  const clearSuccessMessage = () => {
    closeModalHandler();
    setSuccessMessage(null);
  };

  return (
    <React.Fragment>
      <ErrorModal show={error} onClear={clearError} />
      <SuccessModal success={successMessage} onClear={clearSuccessMessage} />
      <Modal
        form
        show={props.show}
        close={closeModalHandler}
        header="Editeaza factura"
        onSubmit={submitHandler}
      >
        {isLoading && <LoadingSpinner asOverlay />}
        {!successMessage && !isLoading && (
          <React.Fragment>
            <header>
              <p className="modalTitle">
                Factura {series} / {number} <span>emisa catre</span> {name}
              </p>
            </header>
            <div className="formGroup flex">
              <Input
                className="input"
                id="issuedDate"
                element="input"
                type="date"
                label="Data emiterii"
                validators={[]}
                defaultValue={new Date(formState.inputs.issuedDate.value)
                  .toISOString()
                  .slice(0, 10)}
                defaultValidity={formState.inputs.issuedDate.isValid}
                onInput={inputHandler}
              />
              <Input
                className="input"
                id="dueDate"
                element="input"
                type="date"
                label="Data scadenta"
                validators={[]}
                defaultValue={new Date(formState.inputs.dueDate.value)
                  .toISOString()
                  .slice(0, 10)}
                defaultValidity={formState.inputs.dueDate.isValid}
                onInput={inputHandler}
              />
            </div>

            <div className="table-wrapper">
              <table className="table invoicingTable">
                <thead>
                  <tr style={{ textAlign: 'left' }}>
                    <th>Serviciu/Ref.</th>
                    <th>Primit/predat</th>
                    <th>Cantitate</th>
                    <th>Tarif</th>
                    <th>Total</th>
                    <th>Optiuni</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceOrders.map((order) => (
                    <EditInvoiceOrders
                      key={order.id}
                      order={order}
                      onUpdateOrders={updateOrders}
                      totalInvoiceTouched={totalInvoiceTouched}
                    />
                  ))}
                  <tr
                    style={{
                      fontWeight: '700',
                      textAlign: 'right',
                      fontSize: '16px',
                    }}
                  >
                    <td
                      colSpan="5"
                      style={{ textAlign: 'right', paddingTop: '50px' }}
                    >
                      Total
                    </td>
                    <td
                      style={{
                        textAlign: 'right',
                        paddingTop: '50px',
                      }}
                    >
                      <input
                        style={{ textAlign: 'center' }}
                        type="text"
                        step="0.01"
                        value={totalInvoice}
                        onChange={(e) => {
                          setTotalInvoiceTouched(true);
                          setTotalInvoice(+e.target.value);
                          setRemainder(
                            props.invoiceData.invoice.totalInvoice -
                              +e.target.value +
                              props.invoiceData.invoice.remainder
                          );
                        }}
                      />
                    </td>
                  </tr>
                  <tr
                    style={{
                      fontWeight: '500',
                      textAlign: 'right',
                      fontSize: '16px',
                    }}
                  >
                    <td colSpan="5" style={{ textAlign: 'right' }}>
                      Rest de platit
                    </td>
                    <td>
                      {remainder.toLocaleString(language, {
                        style: 'currency',
                        currency: currency,
                      })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h5>IMPORTANT</h5>
              <p>
                - Modificarea articolelor individuale recalculeaza totalul, insa
                nu afecteaza restul de platit (AJUSTARI).
              </p>
              <p>
                - Modificarea totalului dezactiveaza optiunile articolelor
                individuale si afecteaza restul de platit (INCASARE PARTIALA).
              </p>
            </div>

            <div className="formActions">
              <Button type="submit">SALVEAZA</Button>
              <Button danger type="button" onClick={closeModalHandler}>
                ANULEAZA
              </Button>
            </div>
          </React.Fragment>
        )}
      </Modal>
    </React.Fragment>
  );
};

export default EditInvoice;
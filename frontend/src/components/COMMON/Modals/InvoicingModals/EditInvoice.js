import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';

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
import { formatCurrency } from '../../../../utilities/format-currency';

const EditInvoice = (props) => {
  const { token, language, theme } = useContext(AuthContext);
  const [successMessage, setSuccessMessage] = useState();
  const [invoiceOrders, setInvoiceOrders] = useState([]);
  const [ordersEdited, setOrdersEdited] = useState([]);
  const [ordersDeleted, setOrdersDeleted] = useState([]);
  const [totalInvoiceTouched, setTotalInvoiceTouched] = useState(false);

  const { t } = useTranslation();

  const [totalInvoice, setTotalInvoice] = useState(
    props.invoiceData.invoice.totalInvoice
  );
  const [remainder, setRemainder] = useState(
    props.invoiceData.invoice.remainder || 0
  );

  const { series, number, dueDate, issuedDate, orders } =
    props.invoiceData.invoice;
  const { name } = props.invoiceData.client;

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
          `${process.env.REACT_APP_BACKEND_URL}/orders`,
          'GET',
          null,
          {
            Authorization: 'Bearer ' + token,
            'Accept-Language': language,
            Payload: JSON.stringify(orders),
          }
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
        `${process.env.REACT_APP_BACKEND_URL}/orders',
        'GET`,
        null,
        {
          Authorization: 'Bearer ' + token,
          'Accept-Language': language,
          Payload: JSON.stringify(orders),
        }
      );
      setInvoiceOrders(responseData.message);
    } catch (error) {}

    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/invoicing/${props.invoiceData.invoice._id}`,
        'GET',
        null,
        { Authorization: 'Bearer ' + token, 'Accept-Language': language }
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
        `${process.env.REACT_APP_BACKEND_URL}/invoicing/modify-invoice`,
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
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
          'Accept-Language': language,
        }
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
        header={t('modals.invoicing.edit.header')}
        onSubmit={submitHandler}
      >
        {isLoading && <LoadingSpinner asOverlay />}
        {!successMessage && !isLoading && (
          <div className="editInvoice">
            <header>
              <p className="modalTitle">
                {t('invoicing.invoice.title')} {series} / {number}{' '}
                <span>{t('modals.invoicing.edit.issuedTo')}</span> {name}
              </p>
            </header>
            <div className="formGroup flexRow">
              <Input
                className="input"
                id="issuedDate"
                element="input"
                type="date"
                label={t('invoicing.invoice.issuedDate')}
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
                label={t('invoicing.invoice.maturity')}
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
                    <th>{t('modals.invoicing.edit.jobRef')}</th>
                    <th>{t('invoicing.invoice.qty')}</th>
                    <th>{t('orders.rate')}</th>
                    <th>{t('orders.total')}</th>
                    <th>{t('modals.invoicing.edit.options')}</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceOrders.map((order) => (
                    <EditInvoiceOrders
                      key={order.id}
                      order={order}
                      client={props.invoiceData.client}
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
                      {t('invoicing.invoice.value')}
                    </td>
                    <td
                      style={{
                        textAlign: 'right',
                        paddingTop: '50px',
                      }}
                    >
                      <input
                        style={{
                          textAlign: 'center',
                          background: theme === 'dark' && 'black',
                        }}
                        type="text"
                        step="0.01"
                        value={totalInvoice}
                        onChange={(e) => {
                          setTotalInvoiceTouched(true);
                          setTotalInvoice(+e.target.value);
                          setRemainder(
                            props.invoiceData.invoice.totalInvoice -
                              +e.target.value +
                              (props.invoiceData.invoice.remainder || 0)
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
                      {t('invoicing.invoice.remainder')}
                    </td>
                    <td>
                      {formatCurrency(
                        language,
                        props.invoiceData.client.currency,
                        remainder,
                        props.invoiceData.client.decimalPoints
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h5>{t('modals.invoicing.edit.important')}</h5>
              <p>{t('modals.invoicing.edit.note1')}</p>
              <p>{t('modals.invoicing.edit.note2')}</p>
            </div>

            <div className="formActions">
              <Button primary type="submit">
                {t('buttons.saveBtn')}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </React.Fragment>
  );
};

export default EditInvoice;

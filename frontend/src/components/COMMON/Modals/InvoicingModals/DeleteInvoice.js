import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import ErrorModal from '../MessageModals/ErrorModal';
import SuccessModal from '../MessageModals/SuccessModal';
import Modal from '../../UIElements/Modal';
import Button from '../../UIElements/Button';
import LoadingSpinner from '../../UIElements/LoadingSpinner';

import { useHttpClient } from '../../../../hooks/useHttpClient';
import { AuthContext } from '../../../../context/auth-context';

import '../../CSS/modals-form.css';
import '../../CSS/modals-layout.css';
import '../../CSS/table.css';

const DeleteInvoice = (props) => {
  const { token, language } = useContext(AuthContext);
  const [invoiceOrders, setInvoiceOrders] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [removeOrders, setRemoveOrders] = useState(true);

  const { t } = useTranslation();

  const { sendRequest, error, clearError, isLoading } = useHttpClient();

  useEffect(() => {
    const getOrders = async () => {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/orders',
        'GET`,
        null,
        {
          Authorization: 'Bearer ' + token,
          'Accept-Language': language,
          Payload: JSON.stringify(props.invoiceData.invoice.orders),
        }
      );
      setInvoiceOrders(responseData.message);
    };
    getOrders();
  }, [props.invoiceData.invoice.orders, sendRequest, token]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/invoicing/delete-invoice/${props.invoiceData.invoice._id}/?removeOrders=${removeOrders}`,
        'DELETE',
        null,
        { Authorization: 'Bearer ' + token, 'Accept-Language': language }
      );
      setSuccessMessage(responseData.message);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const closeModalHandler = () => {
    props.onCloseModal();
    setRemoveOrders(true);
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
        header={t('modals.invoicing.cancel.header')}
        onSubmit={submitHandler}
      >
        {isLoading && <LoadingSpinner asOverlay />}
        {!successMessage && !isLoading && (
          <div className="deleteInvoice">
            <h3 style={{ fontSize: '14px', marginBottom: '20px' }}>
              {t('modals.invoicing.cancel.note')}:
            </h3>
            <div className="table-wrapper">
              <table className="table invoicingTable">
                <thead>
                  <tr style={{ textAlign: 'left' }}>
                    <th>{t('invoicing.invoice.typeRef')}</th>
                    <th>{t('statements.statement.receivedDelivered')}</th>
                    <th>{t('invoicing.invoice.qty')}</th>
                    <th>{t('orders.rate')}</th>
                    <th>{t('orders.total')}</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceOrders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        {order.service}/{order.reference}
                      </td>
                      <td>
                        {new Date(order.receivedDate).toLocaleDateString(
                          language
                        )}
                        /
                        {new Date(order.deliveredDate).toLocaleDateString(
                          language
                        )}
                      </td>
                      <td>{order.count.toLocaleString(language)}</td>
                      <td>
                        {order.rate.toLocaleString(language, {
                          style: 'currency',
                          currency: order.currency,
                        })}
                      </td>
                      <td>
                        {order.total.toLocaleString(language, {
                          style: 'currency',
                          currency: order.currency,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: '20px' }}>
              <div
                style={{
                  fontSize: '14px',
                  display: 'flex',
                  justifyContent: 'baseline',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <input
                  type="checkbox"
                  onChange={() => setRemoveOrders((prev) => !prev)}
                />
                <p>{t('modals.invoicing.cancel.keepNote')}</p>
              </div>
            </div>
            <div className="formActions">
              <Button
                danger
                // disabled={props.invoiceData.invoice.cashed}
                type="submit"
              >
                {t('buttons.confirmBtn')}
              </Button>
            </div>

            <p className="center error">{errorMessage && errorMessage}</p>
          </div>
        )}
      </Modal>
    </React.Fragment>
  );
};

export default DeleteInvoice;

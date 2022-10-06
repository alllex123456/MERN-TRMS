import React, { useState, useEffect, useContext } from 'react';
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
  const [successMessage, setSuccessMessage] = useState();
  const [removeOrders, setRemoveOrders] = useState(true);

  const { sendRequest, error, clearError, isLoading } = useHttpClient();

  useEffect(() => {
    const getOrders = async () => {
      const responseData = await sendRequest(
        'http://localhost:8000/orders',
        'GET',
        null,
        {
          Authorization: 'Bearer ' + token,
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
        `http://localhost:8000/invoicing/delete-invoice/${props.invoiceData.invoice._id}/?removeOrders=${removeOrders}`,
        'DELETE',
        null,
        { Authorization: 'Bearer ' + token }
      );
      setSuccessMessage(responseData.message);
    } catch (error) {}
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
        header="Anuleaza factura"
        onSubmit={submitHandler}
      >
        {isLoading && <LoadingSpinner asOverlay />}
        {!successMessage && !isLoading && (
          <React.Fragment>
            <h3 style={{ fontSize: '14px', marginBottom: '20px' }}>
              Urmatoarele articole continute in factura pot si sterse sau
              pastrate pentru facturare ulterioara:
            </h3>
            <div className="table-wrapper">
              <table className="table invoicingTable">
                <thead>
                  <tr style={{ textAlign: 'left' }}>
                    <th>Serviciu/Ref.</th>
                    <th>Primit/predat</th>
                    <th>Cantitate</th>
                    <th>Tarif</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceOrders.map((order) => (
                    <tr>
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
                <p>Doresc pastrarea articolelor</p>
              </div>
            </div>
            <div className="formActions">
              <Button danger type="submit">
                CONFIRM
              </Button>
              <Button type="button" onClick={closeModalHandler}>
                INAPOI
              </Button>
            </div>
          </React.Fragment>
        )}
      </Modal>
    </React.Fragment>
  );
};

export default DeleteInvoice;

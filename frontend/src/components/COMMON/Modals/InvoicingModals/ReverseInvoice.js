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
import { CurrencyBtc } from 'phosphor-react';

const ReverseInvoice = (props) => {
  const { token, language } = useContext(AuthContext);
  const [invoiceOrders, setInvoiceOrders] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const [formState, inputHandler] = useForm({}, false);

  const { sendRequest, error, clearError, isLoading } = useHttpClient();

  useEffect(() => {
    const getOrders = async () => {
      try {
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
      } catch (error) {}
    };
    getOrders();
  }, [sendRequest, props.invoiceData.invoice.orders, token]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const responseData = await sendRequest(
        'http://localhost:8000/invoicing/cash-invoice',
        'PATCH',
        JSON.stringify({
          invoiceId: props.invoiceData.invoice.id,
          cashedAmount: formState.inputs.cashedAmount.value,
          receipt: formState.inputs.receipt.value,
          dateCashed: new Date(formState.inputs.dateCashed.value).toISOString(),
        }),
        { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }
      );
      setSuccessMessage(responseData.message);
      props.onUpdate();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };
  const closeModalHandler = () => {
    props.onCloseModal();
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
        header="Storneaza factura"
        onSubmit={submitHandler}
      >
        {isLoading && <LoadingSpinner asOverlay />}
        {!successMessage && !isLoading && (
          <React.Fragment>
            <header>
              <p className="modalTitle">
                Factura {props.invoiceData.invoice.series} /{' '}
                {props.invoiceData.invoice.number} <span>emisa catre</span>{' '}
                {props.invoiceData.client.name}
              </p>
            </header>
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
                      <td>{`${order.service}/${order.reference}`}</td>
                      <td>{`${new Date(order.receivedDate).toLocaleDateString(
                        language
                      )}/${new Date(order.deliveredDate).toLocaleDateString(
                        language
                      )}`}</td>
                      <td>{order.count.toLocaleString(language)}</td>
                      <td>
                        {order.rate.toLocaleString(language, {
                          style: 'currency',
                          currency: order.currency,
                        })}
                      </td>
                      <td>
                        -
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
            <div className="formActions">
              <Button primary type="submit" disabled={!formState.isValid}>
                EMITE STORNO
              </Button>
              <Button secondary type="button" onClick={closeModalHandler}>
                ANULEAZA
              </Button>
            </div>
            <p className="center error">{errorMessage}</p>
          </React.Fragment>
        )}
      </Modal>
    </React.Fragment>
  );
};

export default ReverseInvoice;

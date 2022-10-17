import React, { useState, useEffect, useContext } from 'react';
import { addDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';

import Input from '../COMMON/FormElements/Input';
import ErrorModal from '../COMMON/Modals/MessageModals/ErrorModal';
import LoadingSpinner from '../COMMON/UIElements/LoadingSpinner';
import Button from '../COMMON/UIElements/Button';

import { ArrowLeft } from 'phosphor-react';
import { AuthContext } from '../../context/auth-context';
import { quantity } from '../../utilities/measurements';
import { useHttpClient } from '../../hooks/useHttpClient';
import { getReadableUnit } from '../../utilities/get-units';
import { translateServices } from '../../utilities/translate-units';
import { useForm } from '../../hooks/useForm';
import { VALIDATOR_REQUIRE } from '../../utilities/form-validator';
import { blobAnchor } from '../../utilities/blob-anchor';
import { formatCurrency } from '../../utilities/format-currency';

import styles from './InvoiceTemplate.module.css';

const InvoiceTemplate = ({ view, invoice, back, client, clientOrders }) => {
  const navigator = useNavigate();

  const { token, units, language } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [invoiceId, setInvoiceId] = useState();
  const [successMessage, setSuccessMessage] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [invoiceIssued, setInvoiceIssued] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const totalInvoice = +clientOrders
    .reduce((acc, val) => (acc += val.total), 0)
    .toFixed(client.decimalPoints);

  const [formState, inputHandler, setFormData] = useForm(
    {
      dueDate: {
        value: '',
        isValid: true,
      },
      totalInvoice: {
        value: (totalInvoice + client.remainder).toFixed(client.decimalPoints),
        isValid: true,
      },
    },
    true
  );

  const remainder = +(
    totalInvoice +
    client.remainder -
    formState.inputs.totalInvoice.value
  ).toFixed(client.decimalPoints);

  const { sendRequest, isLoading, error, clearError } = useHttpClient();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const responseData = await sendRequest(
          'http://localhost:8000/user',
          'GET',
          null,
          { Authorization: 'Bearer ' + token }
        );
        setUserData(responseData.message);

        setFormData(
          {
            dueDate: {
              value: client.invoiceDue
                ? addDays(new Date(), client.invoiceDue)
                : addDays(new Date(), responseData.message.invoiceDefaultDue),
              isValid: true,
            },
            totalInvoice: {
              value: (totalInvoice + client.remainder).toFixed(
                client.decimalPoints
              ),
              isValid: true,
            },
          },
          true
        );
      } catch (error) {}
    };

    getUserData();
  }, [
    sendRequest,
    token,
    client.invoiceDue,
    client.remainder,
    setFormData,
    totalInvoice,
  ]);

  const submitHandler = async (e) => {
    e.preventDefault();

    setIsProcessing(true);

    try {
      const responseData = await sendRequest(
        `http://localhost:8000/invoicing/${client._id}`,
        'POST',
        JSON.stringify({
          clientId: client._id,
          orders: clientOrders.map((order) => order.id),
          totalInvoice: formState.inputs.totalInvoice.value,
          dueDate: new Date(formState.inputs.dueDate.value).toISOString(),
          issuedDate: new Date().toISOString(),
          remainder,
        }),
        { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }
      );
      setInvoiceId(responseData.invoiceId);
      setSuccessMessage(responseData.message);
      setInvoiceIssued(true);
    } catch (error) {
      setErrorMessage(error);
    }

    setIsProcessing(false);
  };
  const exportInvoice = () => {
    fetch(`http://localhost:8000/invoicing/pdf/${invoiceId}`, {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + token },
    })
      .then((response) => {
        if (response.status !== 200) throw new Error();
        return response.blob();
      })
      .then((blob) => blobAnchor(`Factura[${client.name}].pdf`, blob))
      .catch((error) => {
        setErrorMessage(
          'Nu s-a putut genera factura. Va rugam sa reincercati!'
        );
      });
  };

  const sendInvoice = async () => {
    setIsProcessing(true);

    if (!client.email) {
      setErrorMessage('Nu ati adaugat o adresa de email acestui client.');
      setSuccessMessage(null);
      setIsProcessing(false);
      return;
    }

    try {
      const responseData = await sendRequest(
        'http://localhost:8000/invoicing/send-invoice',
        'POST',
        JSON.stringify({ clientId: client._id }),
        { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }
      );
      setSuccessMessage(responseData.message);
      setIsProcessing(false);
    } catch (error) {}
  };

  return (
    <React.Fragment>
      <ErrorModal show={error} onClear={clearError} />

      <form className={`${styles.invoice}`} onSubmit={submitHandler}>
        <div className={styles.invoiceControls}>
          {view ? null : (
            <Button
              className={styles.back}
              type="button"
              onClick={() =>
                !invoiceIssued
                  ? back()
                  : navigator('/statements', { replace: true })
              }
            >
              <ArrowLeft size={24} /> Înapoi
            </Button>
          )}
        </div>
        {isLoading && <LoadingSpinner asOverlay />}
        {isProcessing && <LoadingSpinner asOverlay />}
        <header className={styles.invoiceHeader}>
          <div className={styles.invoiceHeader}>
            <div className={styles.invoiceTitle}>
              <h1>FACTURA</h1>
              <h2>
                <span>serie</span>{' '}
                {view ? invoice.series : userData.invoiceSeries}/
                <span>nr. </span>
                {view ? invoice.number : userData.invoiceStartNumber}
              </h2>

              <div className={styles.invoiceDates}>
                <p>Data emiterii {new Date().toLocaleDateString(language)}</p>
                <div>
                  Data scadenta{' '}
                  {formState.inputs.dueDate.value && !view && (
                    <Input
                      disabled={invoiceIssued}
                      element="input"
                      id="dueDate"
                      type="date"
                      onInput={inputHandler}
                      defaultValue={new Date(formState.inputs.dueDate.value)
                        .toISOString()
                        .slice(0, 10)}
                    />
                  )}
                  {view &&
                    new Date(invoice.issuedDate).toLocaleDateString(language)}
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className={styles.invoiceParties}>
          <div className={styles.supplierData}>
            <div className={styles.legalData}>
              <p>
                <span>Furnizor: </span>
                {userData.name}
              </p>
              <p>
                <span>Sediul: </span>
                {userData.registeredOffice}
              </p>
              <p>
                <span>Nr. de inregistrare: </span>
                {userData.registrationNumber}
              </p>
              <p>
                <span>Cod fiscal: </span>
                {userData.taxNumber}
              </p>
              <p>
                <span>Banca: </span>
                {userData.bank}
              </p>
              <p>
                <span>IBAN: </span>
                {userData.iban}
              </p>
            </div>
            <div className={styles.contactData}>
              <span>Contact</span>
              <p>
                <span>Email: </span>
                {userData.email}
              </p>
              <p>
                <span>Telefon: </span>
                {userData.phone}
              </p>
            </div>
          </div>
          <div className={styles.clientData}>
            <div className={styles.legalData}>
              <p>
                <span>Client: </span>
                {client.name}
              </p>
              <p>
                <span>Sediul: </span>
                {client.registeredOffice}
              </p>
              <p>
                <span>Nr. de inregistrare: </span>
                {client.registrationNumber}
              </p>
              <p>
                <span>Cod fiscal: </span>
                {client.taxNumber}
              </p>
              <p>
                <span>Banca: </span>
                {client.bank}
              </p>
              <p>
                <span>IBAN: </span>
                {client.iban}
              </p>
            </div>
            <div className={styles.contactData}>
              <span>Contact</span>
              <p>
                <span>Email: </span>
                {client.email}
              </p>
              <p>
                <span>Telefon: </span>
                {client.phone}
              </p>
            </div>
          </div>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.invoiceTable}>
            <thead className={styles.invoiceTableHeading}>
              <tr>
                <th>Nr.</th>
                <th>Tip serviciu/Referinta client</th>
                <th>Cantitate</th>
                <th>Unitate de masura</th>
                <th>Tarif*</th>
                <th>Valoare ({client.currency})</th>
              </tr>
            </thead>

            <tbody className={styles.invoiceTableBody}>
              <tr>
                <td>0</td>
                <td>Sold client</td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                  {formatCurrency(
                    language,
                    client.currency,
                    client.remainder,
                    client.decimalPoints
                  )}
                </td>
              </tr>
              {clientOrders.map((order, index) => (
                <tr key={order.id}>
                  <td>{index + 1}</td>
                  <td>
                    {translateServices([order.service]).displayedValue}/
                    {order.reference}
                  </td>

                  <td>
                    <p>{order.count.toLocaleString()}</p>
                  </td>
                  <td>
                    <p>{quantity(order)}</p>
                  </td>
                  <td>
                    {order.rate} / {getReadableUnit(units, order.unit)}
                  </td>

                  <td>
                    {order.total
                      .toFixed(client.decimalPoints)
                      .toLocaleString(language)}
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot className={styles.invoiceTableFooter}></tfoot>
          </table>
        </div>
        <p>*{client.currency}/unitate de tarifare</p>
        <div className={styles.invoiceTotals}>
          <Input
            disabled={invoiceIssued || view}
            element="input"
            label="DE PLATA:"
            type="number"
            id="totalInvoice"
            onInput={inputHandler}
            validators={[VALIDATOR_REQUIRE]}
            defaultValue={formState.inputs.totalInvoice.value}
          />
          <p>
            Rest de plata:{' '}
            {formatCurrency(
              language,
              client.currency,
              remainder,
              client.decimalPoints
            )}
          </p>
          <div className={styles.invoiceActions}>
            {!error && successMessage && (
              <p className={styles.successMessage}>{successMessage}</p>
            )}
            {errorMessage && (
              <p className={styles.errorMessage}>{errorMessage}</p>
            )}
            {!invoiceIssued && !view && (
              <Button primary className={styles.issue} type="submit">
                Emite
              </Button>
            )}
            {!error && invoiceIssued && (
              <div className={styles.exportSendGroup}>
                <Button primary type="button" onClick={exportInvoice}>
                  Exporta PDF
                </Button>
                <Button primary type="button" onClick={sendInvoice}>
                  Trimite catre client
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className={styles.invoiceNotes}>
          <div>
            <p>
              Plata se va face in contul: <strong>{userData.iban}</strong>,
              deschis la Banca: <strong>{userData.bank}</strong>, pana cel
              tarziu la:{' '}
              <strong>
                {new Date(formState.inputs.dueDate.value).toLocaleDateString()}
              </strong>
              .
            </p>
          </div>
        </div>
        <div>Mentiuni: {userData.invoiceNotes}</div>
      </form>
    </React.Fragment>
  );
};

export default InvoiceTemplate;

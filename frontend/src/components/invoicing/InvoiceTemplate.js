import React, { useState, useEffect, useContext } from 'react';
import { addDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Input from '../COMMON/FormElements/Input';
import ErrorModal from '../COMMON/Modals/MessageModals/ErrorModal';
import LoadingSpinner from '../COMMON/UIElements/LoadingSpinner';
import Button from '../COMMON/UIElements/Button';

import { ArrowLeft, Plus } from 'phosphor-react';
import { AuthContext } from '../../context/auth-context';
import { quantity } from '../../utilities/measurements';
import { useHttpClient } from '../../hooks/useHttpClient';
import {
  translateServices,
  translateUnits,
} from '../../utilities/translate-units';
import { useForm } from '../../hooks/useForm';
import { VALIDATOR_REQUIRE } from '../../utilities/form-validator';
import { blobAnchor } from '../../utilities/blob-anchor';
import { formatCurrency } from '../../utilities/format-currency';
import { computePages } from '../../utilities/calculate-metrics';

import styles from './InvoiceTemplate.module.css';

const InvoiceTemplate = ({
  issue,
  view,
  reverse,
  invoice,
  back,
  client,
  clientOrders,
}) => {
  const navigator = useNavigate();

  const { token, units, language, theme } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [invoiceId, setInvoiceId] = useState();
  const [orders, setOrders] = useState(
    reverse
      ? clientOrders.map((order) => ({
          ...order,
          count: -order.count,
          total: -order.total,
        }))
      : view
      ? clientOrders.concat(invoice.addedItems)
      : clientOrders
  );
  const [successMessage, setSuccessMessage] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [invoiceIssued, setInvoiceIssued] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalInvoice, setTotalInvoice] = useState(
    reverse
      ? -invoice.totalInvoice
      : +orders
          .reduce((acc, val) => (acc += val.total), 0)
          .toFixed(client.decimalPoints)
  );

  const { t } = useTranslation();

  let clientBalance;
  if (reverse)
    clientBalance =
      invoice.clientBalance > 0
        ? -invoice.clientBalance
        : invoice.clientBalance;
  if (view) clientBalance = invoice.clientBalance;
  if (issue) clientBalance = client.remainder;

  const [formState, inputHandler, setFormData] = useForm(
    {
      dueDate: {
        value: '',
        isValid: true,
      },
      totalInvoice: {
        value: reverse
          ? (totalInvoice + clientBalance + invoice.invoiceRemainder).toFixed(
              client.decimalPoints
            )
          : (totalInvoice + clientBalance).toFixed(client.decimalPoints),
        isValid: true,
      },
      addItem: { value: '', isValid: false },
      addCount: { value: '', isValid: false },
      addUnit: { value: units[0].value, isValid: false },
      addRate: { value: '', isValid: false },
    },
    true
  );

  const remainder = +(
    totalInvoice +
    clientBalance -
    formState.inputs.totalInvoice.value
  ).toFixed(client.decimalPoints);

  const addItemHandler = () => {
    setOrders((prev) => [
      ...prev,
      {
        addedId: Math.random() * 10,
        addedItem: true,
        reference: formState.inputs.addItem.value,
        count: +formState.inputs.addCount.value,
        rate: +formState.inputs.addRate.value,
        unit: formState.inputs.addUnit.value,
        total: +(
          computePages(
            formState.inputs.addUnit.value,
            formState.inputs.addCount.value
          ) * formState.inputs.addRate.value
        )
          .toFixed(client.decimalPoints)
          .toLocaleString(language),
      },
    ]);
    setTotalInvoice(
      (prev) =>
        prev +
        +(
          computePages(
            formState.inputs.addUnit.value,
            formState.inputs.addCount.value
          ) * formState.inputs.addRate.value
        )
          .toFixed(client.decimalPoints)
          .toLocaleString(language)
    );
    setFormData(
      {
        ...formState.inputs,
        totalInvoice: {
          value: (
            totalInvoice +
            computePages(
              formState.inputs.addUnit.value,
              formState.inputs.addCount.value
            ) *
              formState.inputs.addRate.value +
            clientBalance +
            invoice.invoiceRemainder
          ).toFixed(client.decimalPoints),
          isValid: true,
        },
      },
      false
    );
  };

  const { sendRequest, isLoading, error, clearError } = useHttpClient();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/user`,
          'GET',
          null,
          { Authorization: 'Bearer ' + token, 'Accept-Language': language }
        );
        setUserData(responseData.message);

        setFormData(
          {
            ...formState.inputs,
            dueDate: {
              value: client.invoiceDue
                ? addDays(new Date(), client.invoiceDue)
                : addDays(new Date(), responseData.message.invoiceDefaultDue),
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
    clientBalance,
    setFormData,
    totalInvoice,
  ]);

  const submitHandler = async (e) => {
    e.preventDefault();

    setIsProcessing(true);

    if (issue) {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/invoicing/${client._id}`,
          'POST',
          JSON.stringify({
            clientId: client._id,
            orders: orders.map((order) => order.id),
            totalInvoice: formState.inputs.totalInvoice.value,
            dueDate: new Date(formState.inputs.dueDate.value).toISOString(),
            issuedDate: new Date().toISOString(),
            invoiceRemainder: remainder,
            clientBalance,
          }),
          {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
            'Accept-Language': language,
          }
        );
        setInvoiceId(responseData.invoiceId);
        setSuccessMessage(responseData.message);
        setInvoiceIssued(true);
      } catch (error) {
        setErrorMessage(error.message);
      }
    }
    if (reverse) {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/invoicing/${client._id}`,
          'POST',
          JSON.stringify({
            reverse: true,
            reversedInvoice: invoice.id,
            clientId: client._id,
            orders,
            totalInvoice: totalInvoice,
            dueDate: new Date(formState.inputs.dueDate.value).toISOString(),
            issuedDate: new Date().toISOString(),
            invoiceRemainder: 0,
            clientBalance,
          }),
          {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
            'Accept-Language': language,
          }
        );
        setInvoiceId(responseData.invoiceId);
        setSuccessMessage(responseData.message);
        setInvoiceIssued(true);
      } catch (error) {
        setErrorMessage(error.message);
      }
    }

    setIsProcessing(false);
  };

  const exportInvoice = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/invoicing/pdf/${invoiceId}`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
        'Accept-Language': language,
      },
    })
      .then((response) => {
        if (response.status !== 200) throw new Error();
        return response.blob();
      })
      .then((blob) =>
        blobAnchor(`${t('invoicing.invoice.title')}[${client.name}].pdf`, blob)
      )
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  const sendInvoice = async () => {
    setIsProcessing(true);

    if (!client.email) {
      setErrorMessage(t('invoicing.invoice.sendError'));
      setSuccessMessage(null);
      setIsProcessing(false);
      return;
    }

    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/invoicing/send-invoice`,
        'POST',
        JSON.stringify({ clientId: client._id }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
          'Accept-Language': language,
        }
      );
      setSuccessMessage(responseData.message);
      setIsProcessing(false);
    } catch (error) {}
  };

  return (
    <React.Fragment>
      <ErrorModal show={error} onClear={clearError} />

      <form
        className={`${styles.invoice} ${styles[`${theme}Invoice`]}`}
        onSubmit={submitHandler}
      >
        <div className={styles.invoiceControls}>
          <Button
            className={styles.back}
            type="button"
            onClick={() =>
              view
                ? navigator('/invoicing', { replace: true })
                : !invoiceIssued
                ? back()
                : reverse
                ? back()
                : navigator('/statements', { replace: true })
            }
          >
            <ArrowLeft size={24} /> {t('buttons.backBtn')}
          </Button>
        </div>
        {isLoading && <LoadingSpinner asOverlay />}
        {isProcessing && <LoadingSpinner asOverlay />}
        <header className={styles.invoiceHeader}>
          <div className={styles.invoiceTitle}>
            <h1>{t('invoicing.invoice.title').toUpperCase()}</h1>
            <h2>
              <span>{t('invoicing.invoice.series')}</span>{' '}
              {view || reverse ? invoice.series : userData.invoiceSeries}/
              <span>{t('invoicing.invoice.number')} </span>
              {view ? invoice.number : userData.invoiceStartNumber}
            </h2>
            <h5>
              {reverse && `storno factura ${invoice.series} ${invoice.number}`}
            </h5>

            <div className={styles.invoiceDates}>
              <p>
                {t('invoicing.invoice.issuedDate')}{' '}
                {issue
                  ? new Date().toLocaleDateString(language)
                  : new Date(invoice.issuedDate).toLocaleDateString(language)}
              </p>
              <div>
                {t('invoicing.invoice.maturity')}{' '}
                {formState.inputs.dueDate.value && !view && (
                  <Input
                    disabled={invoiceIssued}
                    element="input"
                    id="dueDate"
                    type="date"
                    validators={[VALIDATOR_REQUIRE()]}
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
        </header>
        <div className={styles.invoiceParties}>
          <div className={styles.supplierData}>
            <div className={styles.legalData}>
              <p>
                <span>{t('invoicing.invoice.supplier')}: </span>
                {userData.name}
              </p>
              <p>
                <span>{t('client.registeredOffice')}: </span>
                {userData.registeredOffice}
              </p>
              <p>
                <span>{t('client.registrationNumber')}: </span>
                {userData.registrationNumber}
              </p>
              <p>
                <span>{t('client.taxNumber')}: </span>
                {userData.taxNumber}
              </p>
              <p>
                <span>{t('client.bank')}: </span>
                {userData.bank}
              </p>
              <p>
                <span>{t('client.iban')}: </span>
                {userData.iban}
              </p>
            </div>
            <div className={styles.contactData}>
              <span>{t('invoicing.invoice.contact')}</span>
              <p>
                <span>{t('client.email')}: </span>
                {userData.email}
              </p>
              <p>
                <span>{t('client.phone')}: </span>
                {userData.phone}
              </p>
            </div>
          </div>
          <div className={styles.clientData}>
            <div className={styles.legalData}>
              <p>
                <span>{t('invoicing.invoice.client')}: </span>
                {client.name}
              </p>
              <p>
                <span>{t('client.registeredOffice')}: </span>
                {client.registeredOffice}
              </p>
              <p>
                <span>{t('client.registrationNumber')}: </span>
                {client.registrationNumber}
              </p>
              <p>
                <span>{t('client.taxNumber')}: </span>
                {client.taxNumber}
              </p>
              <p>
                <span>{t('client.bank')}: </span>
                {client.bank}
              </p>
              <p>
                <span>{t('client.iban')}: </span>
                {client.iban}
              </p>
            </div>
            <div className={styles.contactData}>
              <span>{t('invoicing.invoice.contact')}</span>
              <p>
                <span>{t('client.email')}: </span>
                {client.email}
              </p>
              <p>
                <span>{t('client.phone')}: </span>
                {client.phone}
              </p>
            </div>
          </div>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.invoiceTable}>
            <thead className={styles.invoiceTableHeading}>
              <tr>
                <th>{t('invoicing.invoice.no')}</th>
                <th>{t('invoicing.invoice.typeRef')}</th>
                <th>{t('invoicing.invoice.qty')}</th>
                <th>{t('invoicing.invoice.mu')}</th>
                <th>{t('invoicing.invoice.rate')}</th>
                <th>
                  {t('invoicing.invoice.value')} ({client.currency})
                </th>
              </tr>
            </thead>

            <tbody className={styles.invoiceTableBody}>
              <tr>
                <td>0</td>
                <td>{t('invoicing.invoice.clientBalance')}</td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                  {reverse
                    ? formatCurrency(
                        language,
                        client.currency,
                        clientBalance,
                        client.decimalPoints
                      )
                    : formatCurrency(
                        language,
                        client.currency,
                        clientBalance,
                        client.decimalPoints
                      )}
                </td>
              </tr>
              {orders.map((order, index) => (
                <tr key={order.id || order.addedId}>
                  <td>{index + 1}</td>
                  <td>
                    {translateServices([order.service])?.displayedValue}/
                    {order.reference}
                  </td>

                  <td>
                    <p>{order.count.toLocaleString(language)}</p>
                  </td>
                  <td>
                    <p>{translateUnits([order.unit])?.displayedValue}</p>
                  </td>
                  <td>
                    {order.rate}/{translateUnits([order.unit])?.short}
                  </td>

                  <td>
                    {(computePages(order.unit, order.count) * order.rate)
                      .toFixed(client.decimalPoints)
                      .toLocaleString(language)}
                  </td>
                </tr>
              ))}
              {reverse && (
                <tr>
                  <td>
                    <Plus
                      className={styles.addItem}
                      size={20}
                      onClick={addItemHandler}
                    />
                  </td>
                  <td>
                    <Input
                      className={styles.input}
                      id="addItem"
                      element="input"
                      placeholder={t('invoicing.invoice.addItem')}
                      validators={[VALIDATOR_REQUIRE()]}
                      onInput={inputHandler}
                    />
                  </td>
                  <td>
                    <Input
                      className={styles.input}
                      id="addCount"
                      element="input"
                      type="number"
                      step="0.01"
                      placeholder={t('invoicing.invoice.qty')}
                      validators={[VALIDATOR_REQUIRE()]}
                      onInput={inputHandler}
                    />
                  </td>
                  <td>
                    <Input
                      id="addUnit"
                      element="select"
                      validators={[VALIDATOR_REQUIRE()]}
                      onInput={inputHandler}
                    >
                      {units.map((unit) => (
                        <option key={unit.value} value={unit.value}>
                          {unit.displayedValue}
                        </option>
                      ))}
                    </Input>
                  </td>
                  <td>
                    <Input
                      className={styles.input}
                      id="addRate"
                      element="input"
                      type="number"
                      step="0.01"
                      placeholder={t('orders.rate')}
                      validators={[VALIDATOR_REQUIRE()]}
                      onInput={inputHandler}
                    />
                  </td>
                  <td>
                    {(
                      computePages(
                        formState.inputs.addUnit.value,
                        formState.inputs.addCount.value
                      ) * formState.inputs.addRate.value
                    )
                      .toFixed(client.decimalPoints)
                      .toLocaleString(language) === 'NaN'
                      ? 0
                      : (
                          computePages(
                            formState.inputs.addUnit.value,
                            formState.inputs.addCount.value
                          ) * formState.inputs.addRate.value
                        )
                          .toFixed(client.decimalPoints)
                          .toLocaleString(language)}
                  </td>
                </tr>
              )}
            </tbody>

            <tfoot className={styles.invoiceTableFooter}></tfoot>
          </table>
        </div>
        <p>
          *{client.currency}/{t('invoicing.invoice.rateNote')}
        </p>
        <div className={styles.invoiceTotals}>
          {!reverse && (
            <Input
              disabled={invoiceIssued || view}
              element="input"
              label={t('invoicing.invoice.toPay')}
              type="number"
              id="totalInvoice"
              validators={[VALIDATOR_REQUIRE]}
              defaultValue={
                view
                  ? invoice.totalInvoice
                  : formState.inputs.totalInvoice.value
              }
              onInput={inputHandler}
            />
          )}
          {reverse && (
            <p className={styles.reverseTotal}>
              {t('invoicing.invoice.toPay')} <span>{totalInvoice}</span>
            </p>
          )}
          {!reverse && (
            <p>
              {t('invoicing.invoice.remainder')}:{' '}
              {formatCurrency(
                language,
                client.currency,
                view ? invoice.invoiceRemainder : remainder,
                client.decimalPoints
              )}
            </p>
          )}
          <div className={styles.invoiceActions}>
            {!error && successMessage && (
              <p className={styles.successMessage}>{successMessage}</p>
            )}
            {errorMessage && (
              <p className={styles.errorMessage}>{errorMessage}</p>
            )}
            {!invoiceIssued && !view && !reverse && (
              <Button primary className={styles.issue} type="submit">
                {t('buttons.issue')}
              </Button>
            )}
            {reverse && !invoiceIssued && (
              <Button primary className={styles.issue} type="submit">
                {t('buttons.issueReverseBtn')}
              </Button>
            )}
            {!error && invoiceIssued && (
              <div className={styles.exportSendGroup}>
                <Button primary type="button" onClick={exportInvoice}>
                  {t('buttons.exportBtn')}
                </Button>
                <Button primary type="button" onClick={sendInvoice}>
                  {t('buttons.sendToClient')}
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className={styles.invoiceNotes}>
          {' '}
          {t('invoicing.invoice.notes')}: {userData.invoiceNotes}
        </div>
      </form>
    </React.Fragment>
  );
};

export default InvoiceTemplate;

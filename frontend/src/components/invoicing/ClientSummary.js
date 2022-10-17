import React, { useState, useEffect, useContext, useCallback } from 'react';
import { isBefore, isAfter, addDays } from 'date-fns';
import { ArrowDown, ArrowUp } from 'phosphor-react';

import InvoiceSummary from './InvoiceSummary';

import { AuthContext } from '../../context/auth-context';
import { useHttpClient } from '../../hooks/useHttpClient';

import styles from './ClientSummary.module.css';
import LoadingSpinner from '../COMMON/UIElements/LoadingSpinner';
import ErrorModal from '../COMMON/Modals/MessageModals/ErrorModal';

const ClientSummary = (props) => {
  const { language, token, theme } = useContext(AuthContext);
  const [showInvoices, setShowInvoices] = useState(false);
  const [clientInvoices, setClientInvoices] = useState([]);
  const [lastInvoice, setLastInvoice] = useState({});

  const { sendRequest, isLoading, error, clearError } = useHttpClient();

  const getClientInvoices = useCallback(async () => {
    try {
      const responseData = await sendRequest(
        `http://localhost:8000/invoicing/client/${props.client.id}`,
        'GET',
        null,
        { Authorization: 'Bearer ' + token }
      );
      setClientInvoices(responseData.message.invoices);
      const clientInvoices = responseData.message.invoices;

      const invoicesSorted = clientInvoices.sort(
        (a, b) =>
          new Date(b.issuedDate).getDate() - new Date(a.issuedDate).getDate()
      );
      setLastInvoice(invoicesSorted[0]);
    } catch (error) {}
  }, [sendRequest, props.client.id, token]);

  useEffect(() => {
    getClientInvoices();
  }, [getClientInvoices]);

  clientInvoices.map((invoice) => {
    if (
      isBefore(new Date(invoice.dueDate), new Date()) &&
      invoice.cashed === false
    ) {
      invoice.status = 'delayed';
    } else if (
      isAfter(new Date(invoice.dueDate), new Date()) &&
      invoice.cashed === false
    ) {
      invoice.status = 'issued';
    } else if (invoice.cashed === true) {
      invoice.status = 'cashed';
    }
  });

  return (
    <React.Fragment>
      <ErrorModal show={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <li
        className={`${styles.clientSummary} ${styles[`${theme}ClientSummary`]}`}
        onClick={() => setShowInvoices((prev) => !prev)}
      >
        <div>
          <h2 className={styles.name}>{props.client.name}</h2>

          <p className={styles.invoiced}>
            Ultima factură emisă la:{' '}
            {lastInvoice
              ? new Date(lastInvoice.issuedDate).toLocaleDateString(language)
              : 'nu exista facturi emise'}
          </p>
        </div>
        {showInvoices ? (
          <ArrowUp size={32} className={!lastInvoice && styles.none} />
        ) : (
          <ArrowDown className={!lastInvoice && styles.none} size={32} />
        )}
      </li>
      <section
        className={`${styles.clientInvoices} ${
          showInvoices && styles.showInvoices
        }`}
      >
        {showInvoices &&
          clientInvoices
            .filter((invoice) => {
              if (props.invoiceStatus === 'all') return invoice;
              return invoice.status === props.invoiceStatus;
            })
            .filter(
              (invoice) =>
                isBefore(
                  new Date(invoice.issuedDate),
                  new Date(props.dateTo)
                ) &&
                isAfter(
                  addDays(new Date(invoice.issuedDate), 1),
                  new Date(props.dateFrom)
                )
            )
            .sort(
              (a, b) =>
                new Date(b.issuedDate).getDate() -
                new Date(a.issuedDate).getDate()
            )
            .map((invoice) => (
              <InvoiceSummary
                key={invoice._id}
                show={showInvoices}
                client={props.client}
                invoice={invoice}
                onRefresh={getClientInvoices}
              />
            ))}
      </section>
    </React.Fragment>
  );
};

export default ClientSummary;

import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Gear } from 'phosphor-react';

import SendInvoice from '../COMMON/Modals/InvoicingModals/SendInvoice';
import EditInvoice from '../COMMON/Modals/InvoicingModals/EditInvoice';
import ErrorModal from '../COMMON/Modals/MessageModals/ErrorModal';
import LoadingSpinner from '../COMMON/UIElements/LoadingSpinner';
import DeleteInvoice from '../COMMON/Modals/InvoicingModals/DeleteInvoice';
import CashInvoice from '../COMMON/Modals/InvoicingModals/CashInvoice';
import ReverseInvoice from '../COMMON/Modals/InvoicingModals/ReverseInvoice';
import CreateInvoice from './InvoiceTemplate';

import { useHttpClient } from '../../hooks/useHttpClient';
import { formatCurrency } from '../../utilities/format-currency';
import { AuthContext } from '../../context/auth-context';
import { useModal } from '../../hooks/useModal';

import styles from './InvoiceSummary.module.css';

const InvoiceSummary = (props) => {
  const { token, language, theme } = useContext(AuthContext);
  const [showOptions, setShowOptions] = useState(false);
  const [cashed, setCashed] = useState(false);

  const [invoiceData, setInvoiceData] = useState();

  const { modalState, closeModalHandler, showModalHandler } = useModal(
    '',
    '',
    false
  );

  const { sendRequest, isLoading, error, clearError } = useHttpClient();

  const getInvoice = useCallback(async () => {
    try {
      const responseData = await sendRequest(
        `http://localhost:8000/invoicing/${props.invoice._id}`,
        'GET',
        null,
        { Authorization: 'Bearer ' + token }
      );
      setInvoiceData(responseData.message);
    } catch (error) {}
  }, [sendRequest, token]);

  useEffect(() => {
    getInvoice();
  }, [getInvoice]);

  if (cashed) return null;

  return (
    <React.Fragment>
      <ErrorModal show={error} onClear={clearError} />

      <div className={styles.invoiceSummary}>
        {isLoading && <LoadingSpinner asOverlay />}

        {modalState.type === 'SEND_INVOICE' && (
          <SendInvoice
            show={modalState.show}
            onCloseModal={closeModalHandler}
            invoiceData={modalState.contents}
          />
        )}
        {modalState.type === 'CASH_INVOICE' && (
          <CashInvoice
            show={modalState.show}
            onCloseModal={closeModalHandler}
            invoiceData={modalState.contents}
            onUpdate={props.onRefresh}
            onCash={() => setCashed(true)}
          />
        )}
        {modalState.type === 'EDIT_INVOICE' && (
          <EditInvoice
            show={modalState.show}
            onCloseModal={closeModalHandler}
            invoiceData={modalState.contents}
            onUpdate={getInvoice}
          />
        )}
        {modalState.type === 'REVERSE_INVOICE' && (
          <ReverseInvoice
            show={modalState.show}
            onCloseModal={closeModalHandler}
            invoiceData={modalState.contents}
            onUpdate={getInvoice}
          />
        )}
        {modalState.type === 'DELETE_INVOICE' && (
          <DeleteInvoice
            show={modalState.show}
            onCloseModal={closeModalHandler}
            invoiceData={modalState.contents}
            onUpdate={getInvoice}
          />
        )}
        {!isLoading && invoiceData && (
          <React.Fragment>
            <div className={styles.data}>
              <span
                className={`${styles.status} ${
                  styles[`status--${props.invoice.status}`]
                }`}
              >
                {props.invoice.status}
              </span>
              <p className={styles.title}>
                FACTURA{' '}
                <span>
                  {invoiceData.series}/{invoiceData.number}
                </span>
              </p>
              <p className={styles.specifics}>
                Emisa la:{' '}
                {new Date(invoiceData.createdAt).toLocaleDateString(language)}
              </p>
              <p className={styles.specifics}>
                Valoare:{' '}
                {formatCurrency(
                  language,
                  props.client.currency,
                  invoiceData.totalInvoice,
                  props.client.decimalPoints
                )}
              </p>
            </div>
            <div className={`${styles.actions} ${styles[`${theme}Actions`]}`}>
              <Gear
                className={styles.actionsIcon}
                size={32}
                onClick={() => setShowOptions((prev) => !prev)}
              />
              <ul
                className={`${styles.optionsList} ${
                  showOptions && styles.showOptions
                }`}
                onMouseEnter={() => setShowOptions(true)}
                onMouseLeave={() => setShowOptions(false)}
              >
                <li
                  className={styles.option}
                  onClick={() =>
                    window.open(
                      `invoicing/view/${invoiceData.clientId.id}/${invoiceData.id}`,
                      '_blank'
                    )
                  }
                >
                  Vizualizeaza
                </li>
                <li
                  className={styles.option}
                  onClick={() =>
                    showModalHandler('SEND_INVOICE', {
                      invoice: invoiceData.clientId._id,
                      client: props.client,
                    })
                  }
                >
                  Trimite
                </li>
                {!invoiceData.cashed && (
                  <React.Fragment>
                    <li
                      className={styles.option}
                      onClick={() =>
                        showModalHandler('CASH_INVOICE', {
                          invoice: invoiceData,
                          client: props.client,
                        })
                      }
                    >
                      Incaseaza
                    </li>
                    <li
                      className={styles.option}
                      onClick={() =>
                        showModalHandler('EDIT_INVOICE', {
                          invoice: invoiceData,
                          client: props.client,
                        })
                      }
                    >
                      Modifica
                    </li>
                    <li
                      className={styles.option}
                      onClick={() =>
                        showModalHandler('REVERSE_INVOICE', {
                          invoice: invoiceData,
                          client: props.client,
                        })
                      }
                    >
                      Storneaza
                    </li>
                    <li
                      className={styles.option}
                      onClick={() =>
                        showModalHandler('DELETE_INVOICE', {
                          invoice: invoiceData,
                          client: props.client,
                        })
                      }
                    >
                      Anuleaza
                    </li>
                  </React.Fragment>
                )}
              </ul>
            </div>
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );
};

export default InvoiceSummary;

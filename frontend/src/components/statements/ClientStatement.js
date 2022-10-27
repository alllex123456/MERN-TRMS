import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'phosphor-react';
import { useTranslation } from 'react-i18next';

import ClientStatementItem from './ClientStatementItem';
import Button from '../COMMON/UIElements/Button';
import LoadingSpinner from '../COMMON/UIElements/LoadingSpinner';
import AddModal from '../COMMON/Modals/OrderModals/AddModal';
import EditModal from '../COMMON/Modals/OrderModals/EditModal';
import DeleteModal from '../COMMON/Modals/OrderModals/DeleteModal';
import ErrorModal from '../COMMON/Modals/MessageModals/ErrorModal';
import CreateInvoice from '../invoicing/InvoiceTemplate';

import { useHttpClient } from '../../hooks/useHttpClient';
import { useModal } from '../../hooks/useModal';
import { AuthContext } from '../../context/auth-context';
import { getReadableUnit } from '../../utilities/get-units';
import { formatCurrency } from '../../utilities/format-currency';
import { blobAnchor } from '../../utilities/blob-anchor';

import styles from './ClientStatement.module.css';

const ClientStatement = () => {
  const { token, language, units } = useContext(AuthContext);
  const { clientId } = useParams();
  const navigator = useNavigate();

  const [createInvoice, setCreateInvoice] = useState(false);
  const [clientOrders, setClientOrders] = useState([]);
  const [client, setClient] = useState();
  const [lastInvoice, setLastInvoice] = useState({});
  const [blob, setBlob] = useState();
  const [errorMessage, setErrorMessage] = useState();

  const { t } = useTranslation();

  const { sendRequest, isLoading, error, clearError } = useHttpClient();

  useEffect(() => {
    const getInvoices = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/invoicing/client/${clientId}`,
          'GET',
          null,
          { Authorization: 'Bearer ' + token, 'Accept-Language': language }
        );
        const clientInvoices = responseData.message.invoices;
        const sortedInvoices = clientInvoices.sort(
          (a, b) =>
            new Date(b.issuedDate).getDate() - new Date(a.issuedDate).getDate()
        );
        setLastInvoice(sortedInvoices[0]);
      } catch (error) {}
    };
    getInvoices();
  }, [sendRequest, clientId, language, token]);

  const { modalState, closeModalHandler, showModalHandler } = useModal(
    '',
    '',
    false
  );

  useEffect(() => {
    const getClientStatement = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/statements/client/${clientId}`,
          'GET',
          null,
          { Authorization: 'Bearer ' + token, 'Accept-Language': language }
        );
        setClientOrders(responseData.message.orders);
        setClient(responseData.message.client);
      } catch (error) {}
    };
    getClientStatement();
  }, [token, sendRequest, clientId, language]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/statements/pdf/${clientId}`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
        Payload: new Date().toISOString(),
      },
    })
      .then((result) => {
        if (result.status !== 200) {
          throw new Error(result.message);
        }
        return result.blob();
      })
      .then((blob) => {
        setBlob(blob);
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  }, [clientId, token]);

  const refreshOrders = async () => {
    const responseData = await sendRequest(
      `${process.env.REACT_APP_BACKEND_URL}/statements/client/${clientId}`,
      'GET',
      null,
      { Authorization: 'Bearer ' + token, 'Accept-Language': language }
    );
    setClientOrders(responseData.message.orders);
  };

  const getPDFDocument = () => {
    blobAnchor(`${t('statements.statement.title')}[${client.name}].pdf`, blob);
  };

  const toggleCreateInvoice = () => setCreateInvoice(false);

  const invoicingHandler = () => setCreateInvoice(true);

  if (createInvoice) {
    return (
      <CreateInvoice
        issue
        back={toggleCreateInvoice}
        client={client}
        clientOrders={clientOrders}
      />
    );
  }

  return (
    <React.Fragment>
      {modalState.type === 'ADD' && (
        <AddModal
          clientId={modalState.contents}
          addToStatement
          show={modalState.show}
          onCloseModal={closeModalHandler}
          onAddOrder={refreshOrders}
        />
      )}
      {modalState.type === 'EDIT' && (
        <EditModal
          orderId={modalState.contents}
          show={modalState.show}
          onCloseModal={closeModalHandler}
          onEditOrder={refreshOrders}
        />
      )}
      {modalState.type === 'DELETE' && (
        <DeleteModal
          orderId={modalState.contents}
          show={modalState.show}
          onCloseModal={closeModalHandler}
          onDeleteOrder={refreshOrders}
        />
      )}
      <ErrorModal show={error || errorMessage} onClear={clearError} />

      {isLoading && <LoadingSpinner className="center" />}
      {!isLoading && !error && clientOrders && client && (
        <main className={styles.statementContainer}>
          <div className={styles.statementControls}>
            <Button className={styles.back} onClick={() => navigator(-1)}>
              <ArrowLeft size={24} /> {t('buttons.backBtn')}
            </Button>
            <Button
              className={styles.add}
              type="button"
              onClick={() => showModalHandler('ADD', clientId)}
            >
              + {t('buttons.addBtn')}
            </Button>
          </div>
          <h3 className={styles.clientName}>{client.name}</h3>
          <p>
            {t('client.mu')}: {getReadableUnit(units, client.unit)}
          </p>
          <p className={styles.clientLastInvoice}>
            {t('statements.lastInvoicing')}:{' '}
            {lastInvoice
              ? new Date(lastInvoice.issuedDate).toLocaleDateString(language)
              : 'nu exista'}{' '}
            | {t('statements.prevBalance')}:{' '}
            {formatCurrency(language, client.currency, client.remainder)}
          </p>
          <ul className={styles.statementList}>
            {clientOrders.map((order, index) => (
              <ClientStatementItem
                key={order.id}
                index={index}
                client={client}
                order={order}
                currency={client.currency}
                onShowModal={showModalHandler}
                refreshOrders={refreshOrders}
              />
            ))}
          </ul>
          <div className={styles.statementActions}>
            <Button
              disabled={clientOrders.length === 0}
              primary
              onClick={invoicingHandler}
            >
              {t('statements.statement.invoicing')}
            </Button>

            <Button
              disabled={clientOrders.length === 0}
              primary
              onClick={getPDFDocument}
            >
              {t('buttons.exportBtn')}
            </Button>
          </div>
        </main>
      )}
    </React.Fragment>
  );
};

export default ClientStatement;

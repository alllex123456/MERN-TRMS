import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'phosphor-react';

import ClientStatementItem from './ClientStatementItem';
import Button from '../COMMON/UIElements/Button';
import LoadingSpinner from '../COMMON/UIElements/LoadingSpinner';
import AddModal from '../COMMON/Modals/OrderModals/AddModal';
import EditModal from '../COMMON/Modals/OrderModals/EditModal';
import DeleteModal from '../COMMON/Modals/OrderModals/DeleteModal';
import ErrorModal from '../COMMON/Modals/MessageModals/ErrorModal';
import CreateInvoice from '../invoicing/CreateInvoice';

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
  const [blob, setBlob] = useState();

  const { modalState, closeModalHandler, showModalHandler } = useModal(
    '',
    '',
    false
  );

  const { sendRequest, isLoading, error, clearError } = useHttpClient();

  useEffect(() => {
    const getClientStatement = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:8000/statements/client/${clientId}`,
          'GET',
          null,
          { Authorization: 'Bearer ' + token }
        );
        setClientOrders(responseData.message.orders);
        setClient(responseData.message.client);
      } catch (error) {}
    };
    getClientStatement();
  }, [token, sendRequest, clientId]);

  useEffect(() => {
    fetch(`http://localhost:8000/statements/pdf/${clientId}`, {
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
        alert('Nu s-a putut genera situatia, va rugam sa reincercati');
      });
  }, [clientId, token]);

  const refreshOrders = async () => {
    const responseData = await sendRequest(
      `http://localhost:8000/statements/client/${clientId}`,
      'GET',
      null,
      { Authorization: 'Bearer ' + token }
    );
    setClientOrders(responseData.message.orders);
  };

  const getPDFDocument = () => {
    blobAnchor(`Situatie[${client.name}].pdf`, blob);
  };

  const toggleCreateInvoice = () => setCreateInvoice(false);

  const invoicingHandler = () => setCreateInvoice(true);

  if (createInvoice) {
    return (
      <CreateInvoice
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
      <ErrorModal show={error} onClear={clearError} />

      {isLoading && <LoadingSpinner className="center" />}
      {!isLoading && !error && clientOrders && client && (
        <main className={styles.statementContainer}>
          <div className={styles.statementControls}>
            <Button className={styles.back} onClick={() => navigator(-1)}>
              <ArrowLeft size={24} /> Înapoi
            </Button>
            <Button
              className={styles.add}
              type="button"
              onClick={() => showModalHandler('ADD', clientId)}
            >
              + Adaugă
            </Button>
          </div>
          <h3 className={styles.clientName}>{client.name}</h3>
          <p>Unitate de măsură: {getReadableUnit(units, client.unit)}</p>
          <p className={styles.clientLastInvoice}>
            Ultima facturare: {new Date().toLocaleDateString()} | Rest de la
            ultima facturare:{' '}
            {formatCurrency(language, client.currency, client.remainder)}
          </p>
          <ul className={styles.statementList}>
            {clientOrders.map((order, index) => (
              <ClientStatementItem
                key={order.id}
                index={index}
                order={order}
                currency={client.currency}
                onShowModal={showModalHandler}
                refreshOrders={refreshOrders}
              />
            ))}
          </ul>
          <div className={styles.statementActions}>
            <Button onClick={invoicingHandler}>Facturare</Button>

            <Button onClick={getPDFDocument}>Exportă PDF</Button>
          </div>
        </main>
      )}
    </React.Fragment>
  );
};

export default ClientStatement;

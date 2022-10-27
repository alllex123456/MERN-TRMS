import React, { useState, useContext, useEffect } from 'react';
import { Hourglass } from 'phosphor-react';
import { useTranslation } from 'react-i18next';

import OrderItem from './OrderItem';
import AddModal from '../COMMON/Modals/OrderModals/AddModal';
import EditModal from '../COMMON/Modals/OrderModals/EditModal';
import CompleteModal from '../COMMON/Modals/OrderModals/CompleteModal';
import DeleteModal from '../COMMON/Modals/OrderModals/DeleteModal';
import Button from '../COMMON/UIElements/Button';
import LoadingSpinner from '../COMMON/UIElements/LoadingSpinner';
import ErrorModal from '../COMMON/Modals/MessageModals/ErrorModal';

import { useHttpClient } from '../../hooks/useHttpClient';
import { useModal } from '../../hooks/useModal';
import { AuthContext } from '../../context/auth-context';

import styles from './Queue.module.css';

export const Queue = (props) => {
  const { token, theme, language } = useContext(AuthContext);
  const [loadedOrders, setLoadedOrders] = useState([]);

  const { t } = useTranslation();

  const { modalState, closeModalHandler, showModalHandler } = useModal(
    '',
    '',
    false
  );

  const { sendRequest, isLoading, error, clearError } = useHttpClient();

  const refreshOrders = async () => {
    const responseData = await sendRequest(
      `${process.env.REACT_APP_BACKEND_URL}/orders/get-pending`,
      'GET',
      null,
      { Authorization: 'Bearer ' + token, 'Accept-Language': language }
    );
    setLoadedOrders(responseData.message);
  };

  useEffect(() => {
    const getPendingOrders = async () => {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/orders/get-pending`,
        'GET',
        null,
        { Authorization: 'Bearer ' + token, 'Accept-Language': language }
      );
      setLoadedOrders(responseData.message);
    };
    getPendingOrders();
  }, [sendRequest, token, language]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />

      {modalState.type === 'ADD' && (
        <AddModal
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

      {modalState.type === 'COMPLETE' && (
        <CompleteModal
          orderId={modalState.contents}
          show={modalState.show}
          onCloseModal={closeModalHandler}
          onCompleteOrder={refreshOrders}
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

      <div className="pageContainer">
        <header className={styles.queueHeader}>
          <Hourglass size={32} className={styles.icon} />
          <h2>{t('pending.title')}</h2>
          <Button primary type="button" onClick={() => showModalHandler('ADD')}>
            + {t('pending.addBtn')}
          </Button>
        </header>
        {isLoading && <LoadingSpinner className="center" />}
        {!isLoading && (
          <ul className={styles.queueList}>
            {loadedOrders && loadedOrders.length === 0 && (
              <li className={`center noItems ${theme}NoItems`}>
                {t('pending.noOrders')}
              </li>
            )}
            {loadedOrders &&
              loadedOrders.map((order, index) => (
                <OrderItem
                  key={order.id}
                  itno={index + 1}
                  orderData={order}
                  onShowModal={showModalHandler}
                  onCloseModal={closeModalHandler}
                />
              ))}
          </ul>
        )}
      </div>
    </React.Fragment>
  );
};

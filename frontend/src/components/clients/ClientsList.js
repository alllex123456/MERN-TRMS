import React, { useState, useEffect, useContext } from 'react';
import { AddressBook } from 'phosphor-react';
import { useTranslation } from 'react-i18next';

import ClientItem from './ClientItem';
import DeleteModal from '../COMMON/Modals/ClientModals/DeleteModal';
import EditModal from '../COMMON/Modals/ClientModals/EditModal';
import ViewModal from '../COMMON/Modals/ClientModals/ViewModal';
import Button from '../COMMON/UIElements/Button';
import AddModal from '../COMMON/Modals/ClientModals/AddModal';
import ErrorModal from '../COMMON/Modals/MessageModals/ErrorModal';
import LoadingSpinner from '../COMMON/UIElements/LoadingSpinner';

import { useHttpClient } from '../../hooks/useHttpClient';
import { useModal } from '../../hooks/useModal';
import { AuthContext } from '../../context/auth-context';

import styles from './ClientsList.module.css';

const ClientsList = () => {
  const { token, language, theme } = useContext(AuthContext);
  const [loadedClients, setLoadedClients] = useState();

  const { t } = useTranslation();

  const { modalState, closeModalHandler, showModalHandler } = useModal(
    '',
    '',
    false
  );

  const { sendRequest, isLoading, error, clearError } = useHttpClient();

  const refreshClients = async () => {
    const responseData = await sendRequest(
      `${process.env.REACT_APP_BACKEND_URL}/clients`,
      'GET',
      null,
      { Authorization: 'Bearer ' + token, 'Accept-Language': language }
    );
    setLoadedClients(responseData.message.clients);
  };

  useEffect(() => {
    const getClients = async () => {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/clients`,
        'GET',
        null,
        { Authorization: 'Bearer ' + token, 'Accept-Language': language }
      );
      setLoadedClients(responseData.message.clients);
    };
    getClients();
  }, [token, sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />

      {modalState.type === 'ADD' && (
        <AddModal
          refreshClients={refreshClients}
          show={modalState.show}
          clientData={modalState.contents}
          onCloseModal={closeModalHandler}
        />
      )}
      {modalState.type === 'VIEW' && (
        <ViewModal
          show={modalState.show}
          clientData={modalState.contents}
          onCloseModal={closeModalHandler}
        />
      )}
      {modalState.type === 'EDIT' && (
        <EditModal
          refreshClients={refreshClients}
          show={modalState.show}
          clientData={modalState.contents}
          onCloseModal={closeModalHandler}
        />
      )}
      {modalState.type === 'DELETE' && (
        <DeleteModal
          refreshClients={refreshClients}
          show={modalState.show}
          clientData={modalState.contents}
          onCloseModal={closeModalHandler}
        />
      )}

      <div className="pageContainer">
        <div className={styles.clientsHeader}>
          <AddressBook size={32} className={styles.icon} />
          <h2>{t('clients.header')}</h2>
          <Button primary type="button" onClick={() => showModalHandler('ADD')}>
            + {t('clients.addBtn')}
          </Button>
        </div>

        {isLoading && <LoadingSpinner className="center martop-xl" />}
        {!isLoading && (
          <ul className={styles.clientsList}>
            {loadedClients && loadedClients.length === 0 && (
              <li className={`center noItems ${theme}NoItems`}>
                {t('clients.noClients')}
              </li>
            )}
            {loadedClients &&
              loadedClients.map((client, index) => (
                <ClientItem
                  key={client.id}
                  itno={index + 1}
                  clientData={client}
                  onShowModal={showModalHandler}
                />
              ))}
          </ul>
        )}
      </div>
    </React.Fragment>
  );
};

export default ClientsList;

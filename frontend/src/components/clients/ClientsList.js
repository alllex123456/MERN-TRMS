import React, { useState, useEffect, useContext } from 'react';
import { AddressBook } from 'phosphor-react';

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

const ClientsList = (props) => {
  const { token } = useContext(AuthContext);
  const [loadedClients, setLoadedClients] = useState();

  const { modalState, closeModalHandler, showModalHandler } = useModal(
    '',
    '',
    false
  );

  const { sendRequest, isLoading, error, clearError } = useHttpClient();

  const refreshClients = async () => {
    const responseData = await sendRequest(
      `http://localhost:8000/clients`,
      'GET',
      null,
      { Authorization: 'Bearer ' + token }
    );
    setLoadedClients(responseData.message.clients);
  };

  useEffect(() => {
    const getClients = async () => {
      const responseData = await sendRequest(
        `http://localhost:8000/clients`,
        'GET',
        null,
        { Authorization: 'Bearer ' + token }
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
          <h2>Nomenclator clienți</h2>
          <Button type="button" onClick={() => showModalHandler('ADD')}>
            + Adaugă client nou
          </Button>
        </div>

        {isLoading && <LoadingSpinner className="center martop-xl" />}
        {!isLoading && (
          <ul className={styles.clientsList}>
            {loadedClients && loadedClients.length === 0 && (
              <li className="center noItems">Nu aveți clienți adăugați</li>
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

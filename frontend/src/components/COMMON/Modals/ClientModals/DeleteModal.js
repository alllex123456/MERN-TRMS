import React, { useState, useContext } from 'react';

import Button from '../../UIElements/Button';
import Modal from '../../UIElements/Modal';
import LoadingSpinner from '../../UIElements/LoadingSpinner';
import ErrorModal from '../MessageModals/ErrorModal';
import SuccessModal from '../MessageModals/SuccessModal';

import { useHttpClient } from '../../../../hooks/useHttpClient';
import { AuthContext } from '../../../../context/auth-context';

import '../../CSS/modals-form.css';

const DeleteModal = ({ show, clientData, onCloseModal, refreshClients }) => {
  const { token } = useContext(AuthContext);
  const [successMessage, setSuccessMessage] = useState();
  const { sendRequest, isLoading, error, clearError } = useHttpClient();

  const deleteHandler = async (event) => {
    event.preventDefault();

    try {
      await sendRequest(
        `http://localhost:8000/clients/delete-client/${clientData.id}`,
        'DELETE',
        null,
        { Authorization: 'Bearer ' + token }
      );
      refreshClients();
      setSuccessMessage('Clientul a fost șters cu succes');
    } catch (error) {}
    onCloseModal();
  };

  const closeModalHandler = () => {
    refreshClients();
    onCloseModal();
    setSuccessMessage(null);
  };

  const header = `Șterge client: ${clientData.name}`;

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <SuccessModal success={successMessage} onClear={closeModalHandler} />
      {!error && !successMessage && (
        <Modal
          form
          header={header}
          show={show}
          close={onCloseModal}
          onSubmit={deleteHandler}
        >
          {isLoading && <LoadingSpinner asOverlay />}
          <h2 className="center">Sigur dorești să ștergi acest client?</h2>
          <div className="formActions">
            {!successMessage && <Button type="submit">ȘTERGE</Button>}
            <Button type="button" danger onClick={closeModalHandler}>
              {successMessage ? 'ÎNCHIDE' : 'ANULEAZĂ'}
            </Button>
          </div>
        </Modal>
      )}
    </React.Fragment>
  );
};

export default DeleteModal;

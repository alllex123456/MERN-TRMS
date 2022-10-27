import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../UIElements/Button';
import Modal from '../../UIElements/Modal';
import LoadingSpinner from '../../UIElements/LoadingSpinner';
import ErrorModal from '../MessageModals/ErrorModal';
import SuccessModal from '../MessageModals/SuccessModal';

import { useHttpClient } from '../../../../hooks/useHttpClient';
import { AuthContext } from '../../../../context/auth-context';

import '../../CSS/modals-form.css';

const DeleteModal = ({ show, clientData, onCloseModal, refreshClients }) => {
  const { token, language } = useContext(AuthContext);
  const [successMessage, setSuccessMessage] = useState();

  const { t } = useTranslation();

  const { sendRequest, isLoading, error, clearError } = useHttpClient();

  const deleteHandler = async (event) => {
    event.preventDefault();

    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/clients/delete-client/${clientData.id}`,
        'DELETE',
        null,
        { Authorization: 'Bearer ' + token, 'Accept-Language': language }
      );
      refreshClients();
      setSuccessMessage(responseData.confirmation);
    } catch (error) {}
    onCloseModal();
  };

  const closeModalHandler = () => {
    refreshClients();
    onCloseModal();
    setSuccessMessage(null);
  };

  const header = `${t('modals.clients.deleteClient.header')}: ${
    clientData.name
  }`;

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <SuccessModal success={successMessage} onClear={closeModalHandler} />
      {!error && !successMessage && (
        <Modal
          small
          form
          header={header}
          show={show}
          close={onCloseModal}
          onSubmit={deleteHandler}
        >
          {isLoading && <LoadingSpinner asOverlay />}
          <h2 className="center">
            {t('modals.clients.deleteClient.confirmationMsg')}
          </h2>
          <div className="formActions" style={{ marginTop: '30px' }}>
            <Button primary type="submit">
              {t('buttons.deleteBtn')}
            </Button>
          </div>
        </Modal>
      )}
    </React.Fragment>
  );
};

export default DeleteModal;

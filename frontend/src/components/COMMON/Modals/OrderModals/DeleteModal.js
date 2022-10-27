import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../UIElements/Button';
import Modal from '../../UIElements/Modal';
import ErrorModal from '../../Modals/MessageModals/ErrorModal';
import SuccessModal from '../../Modals/MessageModals/SuccessModal';
import LoadingSpinner from '../../UIElements/LoadingSpinner';

import { useHttpClient } from '../../../../hooks/useHttpClient';
import { AuthContext } from '../../../../context/auth-context';

import '../../CSS/modals-form.css';

const DeleteModal = (props) => {
  const { token, language } = useContext(AuthContext);
  const [successMessage, setSuccessMessage] = useState();

  const { t } = useTranslation();

  const { sendRequest, isLoading, error, clearError } = useHttpClient();

  const deleteHandler = async (event) => {
    event.preventDefault();

    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/orders/delete-order`,
        'DELETE',
        JSON.stringify({ orderId: props.orderId.id }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
          'Accept-Language': language,
        }
      );
      setSuccessMessage(responseData.message);
    } catch (error) {}
    props.onDeleteOrder();
  };

  const closeModalHandler = () => {
    props.onDeleteOrder();
    props.onCloseModal();
    setSuccessMessage(null);
  };

  const header = t('modals.orders.deleteOrder.header');

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <SuccessModal success={successMessage} onClear={closeModalHandler} />
      {!error && !successMessage && (
        <Modal
          form
          header={header}
          show={props.show}
          close={props.onCloseModal}
          onSubmit={deleteHandler}
        >
          {isLoading && <LoadingSpinner asOverlay />}
          <h2 className="center marbo-xl">
            {t('modals.orders.deleteOrder.confirmationMsg')}
          </h2>

          <div className="formActions">
            <Button danger type="submit">
              {t('buttons.confirmBtn')}
            </Button>
          </div>
        </Modal>
      )}
    </React.Fragment>
  );
};

export default DeleteModal;

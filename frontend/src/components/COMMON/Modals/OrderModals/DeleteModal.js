import React, { useState, useContext } from 'react';

import Button from '../../UIElements/Button';
import Modal from '../../UIElements/Modal';
import ErrorModal from '../../Modals/MessageModals/ErrorModal';
import SuccessModal from '../../Modals/MessageModals/SuccessModal';
import LoadingSpinner from '../../UIElements/LoadingSpinner';

import { useHttpClient } from '../../../../hooks/useHttpClient';
import { AuthContext } from '../../../../context/auth-context';

import '../../CSS/modals-form.css';

const DeleteModal = (props) => {
  const { token } = useContext(AuthContext);
  const [successMessage, setSuccessMessage] = useState();
  const { sendRequest, isLoading, error, clearError } = useHttpClient();

  const deleteHandler = async (event) => {
    event.preventDefault();

    try {
      const responseData = await sendRequest(
        'http://localhost:8000/orders/delete-order',
        'DELETE',
        JSON.stringify({ orderId: props.orderId.id }),
        { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }
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

  const header = `Șterge comanda`;

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
            Sigur dorești să ștergi această comandă?
          </h2>

          <div className="formActions">
            <Button danger type="submit">
              CONFIRM
            </Button>
          </div>
        </Modal>
      )}
    </React.Fragment>
  );
};

export default DeleteModal;

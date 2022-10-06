import React, { useState, useEffect, useContext } from 'react';
import Button from '../../UIElements/Button';
import Modal from '../../UIElements/Modal';
import ErrorModal from '../../Modals/MessageModals/ErrorModal';
import LoadingSpinner from '../../UIElements/LoadingSpinner';

import { useHttpClient } from '../../../../hooks/useHttpClient';
import { AuthContext } from '../../../../context/auth-context';
import { getReadableUnit } from '../../../../utilities/get-units';
import { formatCurrency } from '../../../../utilities/format-currency';

import '../../CSS/modals-form.css';

const ViewModal = ({ show, clientData, onCloseModal }) => {
  const { token, units, services, language } = useContext(AuthContext);
  const [loadedData, setLoadedData] = useState();

  const header = `Date client ${clientData.name}`;
  const footer =
    'Ultima modificare la: ' +
    new Date(clientData.updatedAt).toLocaleString('ro').slice(0, 17);
  const mailto = 'mailto:' + clientData.email;

  const { sendRequest, isLoading, error, clearError } = useHttpClient();

  useEffect(() => {
    const getClientData = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:8000/clients/client/${clientData.id}`,
          'GET',
          null,
          { Authorization: 'Bearer ' + token }
        );
        setLoadedData(responseData.message);
      } catch (error) {}
    };
    getClientData();
  }, [clientData.id, sendRequest, token]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        card
        header={header}
        footer={footer}
        show={show}
        close={onCloseModal}
      >
        {isLoading && <LoadingSpinner asOverlay />}
        {loadedData && !error && !isLoading && (
          <div className="viewCard">
            <header className="section clientHeader">
              <div className="clientPhotoContainer">
                {clientData.avatar ? (
                  <img
                    src={`http://localhost:8000/uploads/avatars/${clientData.avatar}`}
                    alt=""
                  />
                ) : (
                  <div className="blankAvatar" />
                )}
              </div>
              <div>
                <h2>{loadedData.name}</h2>
                <span>
                  Adresa de email: <a href={mailto}> {loadedData.email}</a>
                </span>
                <span>Telefon: {loadedData.phone}</span>
              </div>
            </header>

            <div className="section">
              <span>
                {services.map((service) => (
                  <p key={service.value}>
                    Tarif {service.displayedValue}:{' '}
                    {formatCurrency(
                      language,
                      loadedData.currency,
                      loadedData[`${service.value}Rate`]
                    )}
                  </p>
                ))}
              </span>
              <span>
                <strong>Unitate de măsură: </strong>
                {getReadableUnit(units, loadedData.unit)}
              </span>
            </div>
            <div className="section">
              <span>
                <strong>Sediul:</strong> {loadedData.registeredOffice}
              </span>
              <span>
                <strong>Nr. de înregistrare:</strong>{' '}
                {loadedData.registrationNumber}
              </span>
              <span>
                <strong>Cod fiscal:</strong> {loadedData.taxNumber}
              </span>
              <span>
                <strong>Banca:</strong> {loadedData.bank}
              </span>
              <span>
                <strong>IBAN:</strong> {loadedData.iban}
              </span>
            </div>
            <div className="section">
              <span>
                <strong>Note:</strong> {loadedData.notes}
              </span>
              <span>
                Data adăugării:{' '}
                {new Date(loadedData.createdAt)
                  .toLocaleString('ro')
                  .slice(0, 17)}
              </span>
            </div>
            <div className="actions">
              <Button type="button" onClick={() => onCloseModal()}>
                Închide
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </React.Fragment>
  );
};

export default ViewModal;

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
        medium
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
              <div className="clientContacts">
                <p>
                  <strong>Adresa de email:</strong>{' '}
                  <a href={mailto}> {loadedData.email}</a>
                </p>
                <p>
                  <strong>Telefon:</strong> {loadedData.phone}
                </p>
              </div>
            </header>

            <div className="section">
              <p>
                {services.map((service) => (
                  <p style={{ fontStyle: 'italic' }} key={service.value}>
                    Tarif {service.displayedValue}:{' '}
                    {formatCurrency(
                      language,
                      loadedData.currency,
                      loadedData[`${service.value}Rate`]
                    )}
                  </p>
                ))}
              </p>
              <p>
                <strong>Unitate de măsură: </strong>
                {getReadableUnit(units, loadedData.unit)}
              </p>
            </div>
            <div className="section">
              <p>
                <strong>Sediul:</strong> {loadedData.registeredOffice}
              </p>
              <p>
                <strong>Nr. de înregistrare:</strong>{' '}
                {loadedData.registrationNumber}
              </p>
              <p>
                <strong>Cod fiscal:</strong> {loadedData.taxNumber}
              </p>
              <p>
                <strong>Banca:</strong> {loadedData.bank}
              </p>
              <p>
                <strong>IBAN:</strong> {loadedData.iban}
              </p>
            </div>
            <div className="section">
              <p>
                <strong>Note:</strong> {loadedData.notes}
              </p>
              <p>
                Data adăugării:{' '}
                {new Date(loadedData.createdAt).toLocaleString(language)}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </React.Fragment>
  );
};

export default ViewModal;

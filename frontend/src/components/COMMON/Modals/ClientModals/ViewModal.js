import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';

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
  const [loadedData, setLoadedData] = useState({});

  const { t } = useTranslation();

  const header = `${t('modals.clients.viewClient.header')}: ${clientData.name}`;
  const footer = `${t('modals.clients.viewClient.footer')}:
                ${new Date(loadedData.createdAt).toLocaleDateString(language)}`;
  const mailto = 'mailto:' + clientData.email;

  const { sendRequest, isLoading, error, clearError } = useHttpClient();

  useEffect(() => {
    const getClientData = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/clients/client/${clientData.id}`,
          'GET',
          null,
          { Authorization: 'Bearer ' + token, 'Accept-Language': language }
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
                    src={`${process.env.REACT_APP_BACKEND_URL}/uploads/avatars/${clientData.avatar}`}
                    alt=""
                  />
                ) : (
                  <div className="blankAvatar" />
                )}
              </div>
              <div className="clientContacts">
                <p>
                  <strong>{t('client.email')}:</strong>{' '}
                  <a href={mailto}> {loadedData.email}</a>
                </p>
                <p>
                  <strong>{t('client.phone')}:</strong> {loadedData.phone}
                </p>
              </div>
            </header>

            <div className="section">
              <div>
                {services.map((service) => (
                  <p style={{ fontStyle: 'italic' }} key={service.value}>
                    {t('client.rate')} - {service.displayedValue}:{' '}
                    {formatCurrency(
                      language,
                      clientData.currency,
                      clientData[`${service.value}Rate`]
                    )}
                  </p>
                ))}
              </div>
              <p>
                <strong>{t('client.mu')}: </strong>
                {getReadableUnit(units, loadedData.unit)}
              </p>
            </div>
            <div className="section">
              <p>
                <strong>{t('client.registeredOffice')}:</strong>{' '}
                {loadedData.registeredOffice}
              </p>
              <p>
                <strong>{t('client.registrationNumber')}:</strong>{' '}
                {loadedData.registrationNumber}
              </p>
              <p>
                <strong>{t('client.taxNumber')}:</strong> {loadedData.taxNumber}
              </p>
              <p>
                <strong>{t('client.bank')}:</strong> {loadedData.bank}
              </p>
              <p>
                <strong>{t('client.iban')}:</strong> {loadedData.iban}
              </p>
            </div>
            <div className="section">
              <p>
                <strong>{t('client.notes')}:</strong> {loadedData.notes}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </React.Fragment>
  );
};

export default ViewModal;

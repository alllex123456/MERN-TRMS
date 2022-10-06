import React, { useState, useEffect, useContext } from 'react';

import { Pen, User } from 'phosphor-react';
import { AuthContext } from '../../context/auth-context';
import { useHttpClient } from '../../hooks/useHttpClient';
import { useModal } from '../../hooks/useModal';

import ErrorModal from '../COMMON/Modals/MessageModals/ErrorModal';
import LoadingSpinner from '../COMMON/UIElements/LoadingSpinner';
import UpdateProfile from '../COMMON/Modals/UserModals/UpdateProfile';
import UpdateLegalData from '../COMMON/Modals/UserModals/UpdateLegalData';

import styles from './Profile.module.css';
import UpdateInvoicingData from '../COMMON/Modals/UserModals/UpdateInvoicingData';

const Profile = () => {
  const { token } = useContext(AuthContext);
  const [userData, setUserData] = useState({});

  const { sendRequest, isLoading, error, clearError } = useHttpClient();
  const { modalState, closeModalHandler, showModalHandler } = useModal(
    '',
    '',
    false
  );

  useEffect(() => {
    const getUserData = async () => {
      try {
        const responseData = await sendRequest(
          'http://localhost:8000/user',
          'GET',
          null,
          { Authorization: 'Bearer ' + token }
        );
        setUserData(responseData.message);
      } catch (error) {}
    };
    getUserData();
  }, [sendRequest, token, closeModalHandler]);

  const refreshUser = async () => {
    try {
      const responseData = await sendRequest(
        'http://localhost:8000/user',
        'GET',
        null,
        { Authorization: 'Bearer ' + token }
      );
      setUserData(responseData.message);
    } catch (error) {}
  };

  return (
    <React.Fragment>
      {modalState.type === 'UPDATE_PERSONAL_DATA' && (
        <UpdateProfile
          userData={modalState.contents}
          show={modalState.show}
          onCloseModal={closeModalHandler}
          onRefresh={refreshUser}
        />
      )}
      {modalState.type === 'UPDATE_LEGAL_DATA' && (
        <UpdateLegalData
          userData={modalState.contents}
          show={modalState.show}
          onCloseModal={closeModalHandler}
          onRefresh={refreshUser}
        />
      )}
      {modalState.type === 'UPDATE_INVOICING_DATA' && (
        <UpdateInvoicingData
          userData={modalState.contents}
          show={modalState.show}
          onCloseModal={closeModalHandler}
          onRefresh={refreshUser}
        />
      )}
      <ErrorModal show={error} onClear={clearError} />
      <div className={`${styles.profile} pageContainer`}>
        {isLoading && <LoadingSpinner asOverlay />}
        <header className={styles.profileHeader}>
          <User size={32} className={styles.icon} />
          <h2>Profil utilizator</h2>
        </header>
        <main className={styles.profileBody}>
          <div className={styles.personalData}>
            <h2>Date personale</h2>
            <div className={styles.userContent}>
              <h2>Date personale</h2>
              <p>
                Nume <span className={styles.userData}>{userData.alias}</span>
              </p>
              <p>
                Email
                <span className={styles.userData}> {userData.email}</span>
              </p>
              <p>
                Telefon{' '}
                <span className={styles.userData}>{userData.phone}</span>
              </p>
            </div>
            <button
              className={styles.userActions}
              onClick={() => showModalHandler('UPDATE_PERSONAL_DATA', userData)}
            >
              <Pen className={styles.userActionsIcon} size={32} />
              <span>Actualizeaza</span>
            </button>
          </div>
          <div className={styles.legalData}>
            <h2>Date profesionale</h2>
            <div className={styles.userContent}>
              <p>
                Denumire PFA/Societate{' '}
                <span className={styles.userData}>{userData.name}</span>
              </p>
              <p>
                Sediul{' '}
                <span className={styles.userData}>
                  {userData.registeredOffice}
                </span>
              </p>
              <p>
                Numar de inregistrare/autorizatie{' '}
                <span className={styles.userData}>
                  {userData.registrationNumber}
                </span>
              </p>
              <p>
                Cod fiscal{' '}
                <span className={styles.userData}>{userData.taxNumber}</span>
              </p>
            </div>
            <button
              className={styles.userActions}
              onClick={() => showModalHandler('UPDATE_LEGAL_DATA', userData)}
            >
              <Pen className={styles.userActionsIcon} size={32} />
              <span>Actualizeaza</span>
            </button>
          </div>
          <div className={styles.invoicingData}>
            <h2>Date de facturare</h2>
            <div className={styles.userContent}>
              <h5>
                - datele asa cum apar in facturi, impreuna cu datele
                profesionale -
              </h5>
              <p>
                Serie facturi{' '}
                <span className={styles.userData}>
                  {userData.invoiceSeries}
                </span>
              </p>
              <p>
                Numar de incepere facturi{' '}
                <span className={styles.userData}>
                  {userData.invoiceStartNumber}
                </span>
              </p>
              <p>
                Termen implicit de plata{' '}
                <span className={styles.userData}>
                  {userData.invoiceDefaultDue}
                </span>
              </p>
              <p>
                Banca <span className={styles.userData}>{userData.bank}</span>
              </p>
              <p>
                IBAN <span className={styles.userData}>{userData.iban}</span>
              </p>
            </div>
            <button
              className={styles.userActions}
              onClick={() =>
                showModalHandler('UPDATE_INVOICING_DATA', userData)
              }
            >
              <Pen className={styles.userActionsIcon} size={32} />
              <span>Actualizeaza</span>
            </button>
          </div>
        </main>
      </div>
    </React.Fragment>
  );
};

export default Profile;

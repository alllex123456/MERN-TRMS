import React, { useState, useEffect, useContext } from 'react';
import { Pen, User } from 'phosphor-react';
import { useTranslation } from 'react-i18next';

import UpdateInvoicingData from '../COMMON/Modals/UserModals/UpdateInvoicingData';
import ErrorModal from '../COMMON/Modals/MessageModals/ErrorModal';
import LoadingSpinner from '../COMMON/UIElements/LoadingSpinner';
import UpdateProfile from '../COMMON/Modals/UserModals/UpdateProfile';
import UpdateLegalData from '../COMMON/Modals/UserModals/UpdateLegalData';

import { AuthContext } from '../../context/auth-context';
import { useHttpClient } from '../../hooks/useHttpClient';
import { useModal } from '../../hooks/useModal';

import styles from './Profile.module.css';

const Profile = () => {
  const { token, theme, language } = useContext(AuthContext);
  const [userData, setUserData] = useState({});

  const { t } = useTranslation();

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
          `${process.env.REACT_APP_BACKEND_URL}/user`,
          'GET',
          null,
          { Authorization: 'Bearer ' + token, 'Accept-Language': language }
        );
        setUserData(responseData.message);
      } catch (error) {}
    };
    getUserData();
  }, [sendRequest, token, closeModalHandler, language]);

  const refreshUser = async () => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/user`,
        'GET',
        null,
        { Authorization: 'Bearer ' + token, 'Accept-Language': language }
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
          <h2>{t('profile.title')}</h2>
        </header>
        <main className={styles.profileBody}>
          <div className={styles.personalData}>
            <div className={styles.head}>
              <h2>{t('profile.personalData')}</h2>
              <button
                className={`${styles.userActions} ${
                  styles[`${theme}UserActions`]
                }`}
                onClick={() =>
                  showModalHandler('UPDATE_PERSONAL_DATA', userData)
                }
              >
                <Pen className={styles.userActionsIcon} size={28} />
              </button>
            </div>

            <div className={styles.userContent}>
              <p>
                {t('modals.user.personalData.name')}{' '}
                <span className={styles.userData}>{userData.alias}</span>
              </p>
              <p>
                {t('modals.user.personalData.email')}
                <span className={styles.userData}> {userData.email}</span>
              </p>
              <p>
                {t('modals.user.personalData.contact')}{' '}
                <span className={styles.userData}>{userData.phone}</span>
              </p>
            </div>
          </div>
          <div className={styles.legalData}>
            <div className={styles.head}>
              <h2>{t('profile.professionalData')}</h2>
              <button
                className={`${styles.userActions} ${
                  styles[`${theme}UserActions`]
                }`}
                onClick={() => showModalHandler('UPDATE_LEGAL_DATA', userData)}
              >
                <Pen className={styles.userActionsIcon} size={28} />
              </button>
            </div>
            <div className={styles.userContent}>
              <p>
                {t('modals.user.professionalData.name')}{' '}
                <span className={styles.userData}>{userData.name}</span>
              </p>
              <p>
                {t('modals.user.professionalData.registeredOffice')}{' '}
                <span className={styles.userData}>
                  {userData.registeredOffice}
                </span>
              </p>
              <p>
                {t('modals.user.professionalData.registrationNumber')}{' '}
                <span className={styles.userData}>
                  {userData.registrationNumber}
                </span>
              </p>
              <p>
                {t('modals.user.professionalData.taxNumber')}{' '}
                <span className={styles.userData}>{userData.taxNumber}</span>
              </p>
            </div>
          </div>
          <div className={styles.invoicingData}>
            <div className={styles.head}>
              <h2>{t('profile.invoicingData')}</h2>
              <button
                className={`${styles.userActions} ${
                  styles[`${theme}UserActions`]
                }`}
                onClick={() =>
                  showModalHandler('UPDATE_INVOICING_DATA', userData)
                }
              >
                <Pen className={styles.userActionsIcon} size={28} />
              </button>
            </div>
            <div className={styles.userContent}>
              <p>
                {t('modals.user.invoicingData.series')}{' '}
                <span className={styles.userData}>
                  {userData.invoiceSeries}
                </span>
              </p>
              <p>
                {t('modals.user.invoicingData.number')}{' '}
                <span className={styles.userData}>
                  {userData.invoiceStartNumber}
                </span>
              </p>
              <p>
                {t('modals.user.invoicingData.defaultMaturity')}{' '}
                <span className={styles.userData}>
                  {userData.invoiceDefaultDue}
                </span>
              </p>
              <p>
                {t('modals.user.invoicingData.bank')}{' '}
                <span className={styles.userData}>{userData.bank}</span>
              </p>
              <p>
                {t('modals.user.invoicingData.iban')}{' '}
                <span className={styles.userData}>{userData.iban}</span>
              </p>
            </div>
          </div>
        </main>
      </div>
    </React.Fragment>
  );
};

export default Profile;

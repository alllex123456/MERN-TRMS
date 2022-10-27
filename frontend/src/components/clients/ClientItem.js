import React, { useContext } from 'react';
import { Eye, PencilSimple, Trash } from 'phosphor-react';

import { AuthContext } from '../../context/auth-context';
import { getReadableUnit } from '../../utilities/get-units';
import { useTranslation } from 'react-i18next';

import styles from './ClientItem.module.css';

const ClientItem = ({ itno, clientData, onShowModal }) => {
  const { units, services, theme } = useContext(AuthContext);
  const { t } = useTranslation();
  const emailLink = `mailto:${clientData.email}`;

  return (
    <li className={`${styles.clientItem} ${styles[`${theme}ClientItem`]}`}>
      <div className={styles.clientItemNo}>
        <div>{itno}</div>
        <div className={styles.clientPhotoContainer}>
          {clientData.avatar ? (
            <img
              src={`${process.env.REACT_APP_BACKEND_URL}/uploads/avatars/${clientData.avatar}`}
              alt=""
            />
          ) : (
            <div className="blankAvatar" />
          )}
        </div>
      </div>

      <div className={styles.clientItemName}>
        <span>{t('client.name')}</span>
        <p>{clientData.name}</p>
      </div>
      <div className={styles.clientItemPhone}>
        <span>{t('client.phone')}</span>
        <p>{clientData.phone}</p>
      </div>
      <div className={styles.clientItemEmail}>
        <span>{t('client.email')}</span>
        <p>
          <a href={emailLink}>{clientData.email}</a>
        </p>
      </div>
      <div className={styles.clientItemRate}>
        <span>{t('client.rate')}</span>
        <div className={styles.rateGroup}>
          {services.map((service, index) => (
            <div key={index}>
              <p>{service.displayedValue.toUpperCase()}</p>
              <p>
                {clientData[`${service.value}Rate`]} {clientData.currency}/
                {getReadableUnit(units, clientData.unit)}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.clientItemActions}>
        <Eye
          onClick={() => onShowModal('VIEW', clientData)}
          className={styles.clientItemIcon}
          size={24}
        />
        <PencilSimple
          onClick={() => onShowModal('EDIT', clientData)}
          className={styles.clientItemIcon}
          size={24}
        />
        <Trash
          onClick={() => onShowModal('DELETE', clientData)}
          className={styles.clientItemIcon}
          size={24}
        />
      </div>
    </li>
  );
};

export default ClientItem;

import React, { useContext } from 'react';
import { Eye, PencilSimple, Trash } from 'phosphor-react';

import { AuthContext } from '../../context/auth-context';
import { getReadableUnit } from '../../utilities/get-units';
import { translateServices } from '../../utilities/translate-units';

import styles from './ClientItem.module.css';

const ClientItem = ({ itno, clientData, onShowModal }) => {
  const { units, services } = useContext(AuthContext);
  const emailLink = `mailto:${clientData.email}`;

  return (
    <li className={styles.clientItem}>
      <div className={styles.clientItemNo}>
        <div>{itno}</div>
        <div className={styles.clientPhotoContainer}>
          {clientData.avatar ? (
            <img
              src={`http://localhost:8000/uploads/avatars/${clientData.avatar}`}
              alt=""
            />
          ) : (
            <div className="blankAvatar" />
          )}
        </div>
      </div>

      <div className={styles.clientItemName}>
        <span>Nume</span>
        <p>{clientData.name}</p>
      </div>
      <div className={styles.clientItemPhone}>
        <span>Telefon</span>
        <p>{clientData.phone}</p>
      </div>
      <div className={styles.clientItemEmail}>
        <span>Email</span>
        <p>
          <a href={emailLink}>{clientData.email}</a>
        </p>
      </div>
      <div className={styles.clientItemRate}>
        <span>Tarif</span>
        <div className={styles.rateGroup}>
          {services.map((service) => (
            <div key={service}>
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

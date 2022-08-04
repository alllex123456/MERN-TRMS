import React from 'react';
import { Eye, PencilSimple, Trash } from 'phosphor-react';

import styles from './ClientItem.module.css';

const ClientItem = (props) => {
  const { clientData, onShowModal } = props;

  return (
    <li className={styles.clientItem}>
      <span className={styles.item}>{clientData.name}</span>
      <span className={styles.item}>{clientData.phone}</span>
      <span className={styles.item}>{clientData.email}</span>
      <span className={styles.item}>{clientData.rate}</span>
      <span className={styles.item}>{clientData.unit}</span>
      <span className={styles.clientItemActions}>
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
      </span>
    </li>
  );
};

export default ClientItem;

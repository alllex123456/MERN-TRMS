import React, { useState, useContext } from 'react';
import { formatCurrency } from '../../utilities/format-currency';
import { AuthContext } from '../../context/auth-context';

import styles from './ClientSummary.module.css';
import InvoiceSummary from './InvoiceSummary';

const ClientSummary = ({ client }) => {
  const { language } = useContext(AuthContext);
  const [showInvoices, setShowInvoices] = useState(false);

  return (
    <React.Fragment>
      <li
        className={styles.clientSummary}
        onClick={() => setShowInvoices((prev) => !prev)}
      >
        <h2 className={styles.name}>{client.name}</h2>

        <p className={styles.invoiced}>
          Ultima factură emisă la: {new Date().toLocaleDateString(language)}
        </p>
      </li>
      <section
        className={`${styles.clientInvoices} ${
          showInvoices && styles.showInvoices
        }`}
      >
        {showInvoices &&
          client.invoices.map((invoice) => (
            <InvoiceSummary
              key={invoice._id}
              show={showInvoices}
              client={client}
              invoice={invoice}
            />
          ))}
      </section>
    </React.Fragment>
  );
};

export default ClientSummary;

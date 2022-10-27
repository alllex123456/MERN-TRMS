import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import InvoiceTemplate from './InvoiceTemplate';

import { useHttpClient } from '../../hooks/useHttpClient';
import { AuthContext } from '../../context/auth-context';
import ErrorModal from '../COMMON/Modals/MessageModals/ErrorModal';

const ReverseInvoice = () => {
  const { token, language } = useContext(AuthContext);
  const params = useParams();
  const navigator = useNavigate();
  const [invoice, setInvoice] = useState();

  const { t } = useTranslation();

  const { sendRequest, error, clearError } = useHttpClient();

  useEffect(() => {
    const getClientData = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/invoicing/${params.invoiceId}`,
          'GET',
          null,
          { Authorization: 'Bearer ' + token, 'Accept-Language': language }
        );
        setInvoice(responseData.message);
      } catch (error) {}
    };
    getClientData();
  }, []);

  return (
    <React.Fragment>
      <ErrorModal show={error} onClear={clearError} />
      {invoice && (
        <InvoiceTemplate
          reverse
          back={() => navigator(-1)}
          client={invoice.clientId}
          clientOrders={invoice.orders}
          invoice={invoice}
        />
      )}
    </React.Fragment>
  );
};

export default ReverseInvoice;

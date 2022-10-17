import React, { useEffect, useState, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

import InvoiceTemplate from './InvoiceTemplate';

import { useHttpClient } from '../../hooks/useHttpClient';
import { AuthContext } from '../../context/auth-context';
import ErrorModal from '../COMMON/Modals/MessageModals/ErrorModal';

const ViewInvoice = () => {
  const { token } = useContext(AuthContext);
  const [invoice, setInvoice] = useState();
  const params = useParams();

  const { sendRequest, isLoading, error, clearError } = useHttpClient();

  useEffect(() => {
    const getClientData = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:8000/invoicing/${params.invoiceId}`,
          'GET',
          null,
          { Authorization: 'Bearer ' + token }
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
          view
          client={invoice.clientId}
          clientOrders={invoice.orders}
          invoice={invoice}
        />
      )}
    </React.Fragment>
  );
};

export default ViewInvoice;

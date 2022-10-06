const SibApiV3Sdk = require('sib-api-v3-sdk');

exports.sendInvoiceScript = (user, client, body, setEmail) => {
  const { series, number, totalInvoice, dueDate, message } = body;

  const messageBody = () => {
    message.replace('{series}', series);
    message.replace('{number}', number);
    message.replace('{totalInvoice}', totalInvoice);
    message.replace('{dueDate}', dueDate);
    return message;
  };

  SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey =
    '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';

  let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.subject = '{{params.subject}}';
  sendSmtpEmail.htmlContent = `<html><body>
  <p>Stimate colaborator,</p>
  <p>${messageBody()}</p>
  </body></html>`;
  sendSmtpEmail.sender = { name: user.name, email: user.email };
  sendSmtpEmail.to = [{ email: setEmail || client.email, name: client.name }];
  sendSmtpEmail.cc = [{ name: user.name, email: user.email }];
  sendSmtpEmail.replyTo = { name: user.name, email: user.email };
  sendSmtpEmail.params = {
    subject: 'Factura dvs. a fost emisa',
  };
  sendSmtpEmail.attachment = [
    {
      url: `http://localhost:8000/uploads/invoices/Factura[${client.name}].pdf`,
    },
    {
      url: `http://localhost:8000/uploads/invoices/Factura[${client.name}].pdf`,
    },
  ];

  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data) {
      console.log(
        'API called successfully. Returned data: ' + JSON.stringify(data)
      );
    },
    function (error) {
      console.error(error);
    }
  );
};

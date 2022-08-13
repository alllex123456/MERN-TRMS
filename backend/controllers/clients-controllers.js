const Client = require('../models/client');
const HttpError = require('../models/http-error');

exports.getAllClients = (req, res, next) => {
  const { userId } = req.body;

  res.json({ message: userClients });
};

exports.getClient = (req, res, next) => {
  const { clientId } = req.params;

  res.json({ message: foundClient });
};

exports.addClient = async (req, res, next) => {
  const newClient = new Client({
    ...req.body,
    orders: [],
  });

  try {
    await newClient.save();
  } catch (error) {
    return next(
      new HttpError(
        'A survenit o problemă la accesarea bazei de clienți. Vă rugăm să reîncărcați pagina sau contactați administratorul de sistem.',
        500
      )
    );
  }

  res.json({ message: newClient });
};

exports.modifyClient = (req, res, next) => {
  const {
    clientId,
    name,
    email,
    phone,
    rate,
    unit,
    currency,
    registeredOffice,
    registrationNumber,
    taxNumber,
    bank,
    iban,
    notes,
  } = req.body;

  res.json({ message: 'Client updated' });
};

exports.deleteClient = (req, res, next) => {
  const { clientId } = req.body;

  res.json({ message: 'Client removed' });
};

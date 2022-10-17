const fs = require('fs');

const mongoose = require('mongoose');

const Client = require('../models/client');
const User = require('../models/user');

const HttpError = require('../models/http-error');

exports.getAllClients = async (req, res, next) => {
  const { userId } = req.userData;

  let user;
  try {
    user = await User.findById(userId).populate('clients');
  } catch (error) {
    return next(
      new HttpError(
        'A survenit o problemă la interogarea bazei de clienți. Vă rugăm să reîncărcați pagina sau contactați administratorul de sistem.',
        500
      )
    );
  }

  res.json({
    message: {
      clients: user.clients.map((client) => client.toObject({ getters: true })),
    },
  });
};

exports.getClient = async (req, res, next) => {
  const { clientId } = req.params;

  let client;
  try {
    client = await Client.findById(clientId);
  } catch (error) {
    return next(
      new HttpError(
        'A survenit o problemă la interogarea bazei de clienți. Vă rugăm să reîncărcați pagina sau contactați administratorul de sistem.',
        500
      )
    );
  }

  if (client.userId.toString() !== req.userData.userId) {
    return next(
      new HttpError('Nu există autorizație pentru această operațiune.', 401)
    );
  }

  res.json({ message: client.toObject({ getters: true }) });
};

exports.addClient = async (req, res, next) => {
  const { userId } = req.userData;

  let user;
  try {
    user = await User.findById(userId);
  } catch (error) {
    return next(
      new HttpError(
        'A survenit o problemă la interogarea bazei de utilizatori. Vă rugăm să reîncărcați pagina sau contactați administratorul de sistem.',
        500
      )
    );
  }

  const newClient = new Client({
    ...req.body,
    userId,
    orders: [],
    invoices: [],
    remainder: 0,
    decimalPoints: 0,
  });
  user.clients.push(newClient);

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await newClient.save({ session });
    await user.save({ session });
    session.commitTransaction();
  } catch (error) {
    return next(
      new HttpError(
        'A survenit o problemă la salvarea clientului. Vă rugăm să reîncercați sau contactați administratorul de sistem.',
        500
      )
    );
  }

  res.json({ message: newClient.toObject({ getters: true }) });
};

exports.modifyClient = async (req, res, next) => {
  const { clientId } = req.body;

  let client;
  try {
    client = await Client.findById(clientId);
  } catch (error) {
    return next(
      new HttpError(
        'A survenit o problemă la interogarea bazei de clienți. Vă rugăm să reîncărcați pagina sau contactați administratorul de sistem.',
        500
      )
    );
  }

  if (client.userId.toString() !== req.userData.userId) {
    return next(
      new HttpError('Nu există autorizație pentru această operațiune.', 401)
    );
  }

  if (req.file) {
    fs.unlink('uploads/avatars/' + client.avatar, (err) => console.log(err));
    client.avatar = req.file.filename;
  }

  for (const [key, value] of Object.entries(req.body)) {
    if (value) {
      client[key] = value;
    }
  }

  try {
    await client.save();
  } catch (error) {
    return next(
      new HttpError(
        'A survenit o problemă la salvarea modificărilor. Vă rugăm să reîncărcați pagina sau contactați administratorul de sistem.',
        500
      )
    );
  }

  res.json({ message: client.toObject({ getters: true }) });
};

exports.deleteClient = async (req, res, next) => {
  const { clientId } = req.params;

  let client;
  try {
    client = await Client.findById(clientId).populate('userId');
  } catch (error) {
    return next(
      new HttpError(
        'A survenit o problemă la interogarea bazei de clienți. Vă rugăm să reîncărcați pagina sau contactați administratorul de sistem.',
        500
      )
    );
  }

  if (client.userId.id.toString() !== req.userData.userId) {
    return next(
      new HttpError('Nu există autorizație pentru această operațiune.', 401)
    );
  }

  if (client.orders.length !== 0) {
    return next(
      new HttpError(
        'Clientul are comenzi în așteptare sau nefacturate. Finalizați sau arhivați comenzile clientului înainte de a încerca ștergerea acestuia.',
        500
      )
    );
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await client.remove({ session });
    client.userId.clients.pull(client);
    await client.userId.save({ session });
    session.commitTransaction();
  } catch (error) {
    return next(
      new HttpError(
        'A survenit o problemă la ștergerea clientului. Vă rugăm să reîncărcați pagina sau contactați administratorul de sistem.',
        500
      )
    );
  }

  res.json({ message: client.toObject({ getters: true }) });
};

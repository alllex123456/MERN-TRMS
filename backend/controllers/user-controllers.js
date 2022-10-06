const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SibApiV3Sdk = require('sib-api-v3-sdk');

const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const User = require('../models/user');

SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey =
  process.env.SENDINBLUE_KEY;

exports.getUserData = async (req, res, next) => {
  const { userId } = req.userData;

  let user;

  try {
    user = await User.findById(userId, '-password');
  } catch (error) {
    return next(
      new HttpError(
        'Eroare în baza de date la căutarea ID-ului de utilizator sau baza de date este offline. Vă rugăm să reîncercați.',
        500
      )
    );
  }

  if (!user) {
    return next(new HttpError('Utilizatorul nu există.', 401));
  }

  res.json({ message: user.toObject({ getters: true }) });
};

exports.signup = async (req, res, next) => {
  const { email, password, language, preferredCurrency, name } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        'Parola sau adresa de e-mail nu îndeplinesc cerințele de validare: ' +
          errors.errors.map((error) => error.msg),
        500
      )
    );
  }

  let hasUser;
  try {
    hasUser = await User.findOne({ email });
  } catch (error) {
    return next(
      new HttpError(
        'Eroare în baza de date la verificarea utilizatorului sau baza de date este offline. Vă rugăm să reîncercați.',
        500
      )
    );
  }

  if (hasUser) {
    return next(
      new HttpError(
        'Această adresă de e-mail este deja înregistrată. Vă rugăm să vă autentificați.',
        422
      )
    );
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(
      new HttpError(
        'Nu s-a putut genera o parolă securizată (eroare de criptare). Vă rugăm reîncercați.',
        500
      )
    );
  }

  const invoiceTemplate = (
    invoiceSeries = '{serie}',
    invoiceNumber = '{numar}',
    dueDate = '{data scadenta}',
    totalInvoice = '{total}'
  ) => {
    return `Stimate client, vi s-a emis factura seria ${invoiceSeries} numarul ${invoiceNumber}, in valoare totala de ${totalInvoice} si scadenta la ${dueDate}. Factura, impreuna cu situatia lucrarilor facturate, se regasesc atasate acestui mesaj. Va multumesc!`;
  };

  const user = new User({
    email,
    password: hashedPassword,
    preferredCurrency,
    language,
    alias: name,
    clients: [],
    orders: [],
    invoices: [],
    notes: [],
    invoiceTemplate: invoiceTemplate(),
  });

  try {
    await user.save();
  } catch (error) {
    console.log(error);
    return next(
      new HttpError(
        'Eroare în baza de date la înregistrarea utilizatorului sau baza de date este offline. Vă rugăm să reîncercați.',
        500
      )
    );
  }

  let token;
  try {
    token = jwt.sign({ user }, 'zent-freelance-key', { expiresIn: '24h' });
  } catch (error) {
    return next(
      new HttpError(
        'Eroare de server la generarea unui token sau serverul este offline. Vă rugăm să reîncercați.',
        500
      )
    );
  }

  await new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail({
    subject: 'Confirmarea înregistrării în sistemul ZenT-Freelance',
    sender: { email: 'alextanase454@gmail.com', name: 'ZenT-Freelance' },
    replyTo: { email: 'alextanase454@gmail.com', name: 'ZenT-Freelance' },
    to: [{ name: `${user.email}`, email: `${user.email}` }],
    htmlContent:
      '<html><body><h4>Prin acest mesaj vi se confirmă înregistrarea ca utilizator în sistemul ZenT-Freelance.</h4><p>CONDIȚII DE UTILIZARE</p><ul><li>Acest program este în variantă BETA și poate prezenta probleme de fiabilitate până la ieșirea din faza de testare.</li><li>La fel ca în cazul oricărui software, funcționarea neîntreruptă și fără erori nu este garantată.</li><li>Cu toate acestea, au fost implementate toate măsurile pentru a împiedica pierderea de date.</li><li>Vă rugăm să raportați orice probleme de funcționare către această adresă de email.</li></ul></body></html>',
  });

  res.json({
    user: { ...user._doc, password: '' },
    token,
  });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  let user;
  try {
    user = await User.findOne({ email });
  } catch (error) {
    return next(
      new HttpError(
        'Eroare în baza de date la verificarea utilizatorului sau baza de date este offline. Vă rugăm să reîncercați.',
        500
      )
    );
  }

  if (!user) {
    return next(new HttpError('Utilizatorul nu este înregistrat.', 404));
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, user.password);
  } catch (error) {
    return next(
      new HttpError(
        'Eroare la verificarea parolei în baza de utilizatori (eroare de criptare). Vă rugăm să reîncercați.',
        500
      )
    );
  }

  if (!isValidPassword) {
    return next(new HttpError('Parola este incorectă', 401));
  }

  let token;
  try {
    token = jwt.sign({ user }, 'zent-freelance-key', { expiresIn: '24h' });
  } catch (error) {
    return next(
      new HttpError(
        'Eroare de server la generarea unui token sau serverul este offline. Vă rugăm să reîncercați.',
        500
      )
    );
  }

  res.json({ user: { ...user._doc, password: '' }, token });
};

exports.updateUser = async (req, res, next) => {
  const { userId } = req.userData;

  let user;
  try {
    user = await User.findById(userId);
  } catch (error) {
    return next(
      new HttpError(
        'Eroare în baza de date la verificarea utilizatorului sau baza de date este offline. Vă rugăm să reîncercați.',
        500
      )
    );
  }

  if (!user) {
    return next(new HttpError('Utilizatorul nu este înregistrat.', 404));
  }

  if (req.file) {
    fs.unlink('uploads/avatars/' + user.avatar, (err) => console.log(err));
    user.avatar = req.file.filename;
  }

  for (const [key, value] of Object.entries(req.body)) {
    if (value) {
      user[key] = value;
    }
  }

  try {
    await user.save();
  } catch (error) {
    return next(
      new HttpError(
        'Eroare în baza de date la actualizarea utilizatorului sau baza de date este offline. Vă rugăm să reîncercați.',
        500
      )
    );
  }

  res.json({ message: req.file });
};

exports.getRecoverPassword = async (req, res, next) => {
  const { email } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Adresa de email nu este validă.', 500));
  }

  let user;
  try {
    user = await User.find({ email });
  } catch (error) {
    return next(
      new HttpError(
        'Eroare în baza de date la găsirea utilizatorului sau baza de date este offline. Vă rugăm să reîncercați.',
        401
      )
    );
  }

  if (!user) {
    return next(new HttpError('Utilizatorul nu există.', 401));
  }

  let token;
  try {
    token = jwt.sign({ email }, 'zent-freelance-key', { expiresIn: '1h' });
  } catch (error) {
    return next(
      new HttpError(
        'Eroare de server la generarea unui token sau serverul este offline. Vă rugăm să reîncercați.',
        500
      )
    );
  }

  try {
    await new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail({
      subject: 'Resetare parolă ZenT-Freelance',
      sender: { email: 'alextanase454@gmail.com', name: 'ZenT-Freelance' },
      replyTo: { email: 'alextanase454@gmail.com', name: 'ZenT-Freelance' },
      to: [{ name: `${email}`, email: `${email}` }],
      htmlContent: `<html><body><h4>Mergeți la următorul link pentru resetarea parolei în ZenT-Freelance:</h4><a href="http://localhost:3000/reset-password?email=${email}&token=${token}">RESETARE</a><p>Link-ul pentru resetarea parolei este valabil 1 oră.</p></body></html>`,
    });
  } catch (error) {
    return next(
      new HttpError(
        'Eroare de server la generarea unui link de resetare sau serverul este offline. Vă rugăm să reîncercați.',
        500
      )
    );
  }

  res.json({
    message: 'Verificați adresa de email pentru link-ul de resetare',
  });
};

exports.postRecoverPassword = async (req, res, next) => {
  const { password } = req.body;

  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      throw new Error('Link invalid.');
    }
    const decodedToken = jwt.verify(token, 'zent-freelance-key');
    req.userData = { email: decodedToken.email };
  } catch (error) {
    return next(
      new HttpError('Valabilitatea link-ului de resetare a expirat.', 401)
    );
  }

  let user;
  try {
    user = await User.findOne({ email: req.userData.email });
  } catch (error) {
    return next(
      new HttpError(
        'Eroare în baza de date la găsirea utilizatorului sau baza de date este offline. Vă rugăm să reîncercați.',
        401
      )
    );
  }

  if (!user) {
    return next(new HttpError('Utilizatorul nu există.', 401));
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(
      new HttpError(
        'Nu s-a putut genera o parolă securizată (eroare de criptare). Vă rugăm reîncercați.',
        500
      )
    );
  }

  user.password = hashedPassword;

  try {
    await user.save();
  } catch (error) {
    return next(
      new HttpError(
        'Eroare în baza de date la actualizarea utilizatorului sau baza de date este offline. Vă rugăm să reîncercați.',
        500
      )
    );
  }

  res.json({ message: 'Parola a fost schimbată cu succes' });
};

const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const User = require('../models/user');

let DUMMY_USERS = [
  {
    id: 'user1',
    alias: 'nickname',
    name: 'TEST USER SV 1',
    language: 'RO',
    theme: 'default',
    email: 'email@email.com',
    password: '',
    phone: '+40123456789',
    registeredOffice: 'Bucuresti',
    registrationNumber: 'J40/123568',
    taxNumber: 'RO124568',
    bank: 'Transilvania',
    iban: 'RO1853RNCBRO15355566',
  },
  {
    id: 'user2',
    alias: 'nickname2',
    name: 'TEST USER SV 2',
    language: 'EN',
    theme: 'default',
    email: 'email@email.com',
    phone: '+40123456789',
    registeredOffice: 'Bucuresti',
    registrationNumber: 'J40/123568',
    taxNumber: 'RO124568',
    bank: 'Transilvania',
    iban: 'RO1853RNCBRO15355566',
  },
];
exports.DUMMY_USERS = DUMMY_USERS;

exports.getUserData = async (req, res, next) => {
  const { userId } = req.params;

  let user;

  try {
    user = await User.findById(userId);
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
  const { email, password } = req.body;

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

  const newUser = new User({ email, password, clients: [], orders: [] });

  try {
    await newUser.save();
  } catch (error) {
    return next(
      new HttpError(
        'Eroare în baza de date la înregistrarea utilizatorului sau baza de date este offline. Vă rugăm să reîncercați.',
        500
      )
    );
  }

  res.json({ message: newUser });
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
  if (user.password !== password) {
    return next(new HttpError('Parola este incorectă', 401));
  }

  res.json({ message: user.toObject({ getters: true }) });
};

exports.updateUser = async (req, res, next) => {
  const { userId } = req.params;

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

  res.json({ message: 'User updated' });
};

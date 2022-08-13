const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const {
  signup,
  login,
  updateUser,
} = require('../controllers/user-controllers');

router.get('/:userId');
router.post(
  '/signup',
  [
    check('email')
      .normalizeEmail()
      .isEmail()
      .withMessage('Adresa de e-mail introdusă nu este validă'),
    check('password')
      .isLength({ min: 5 })
      .withMessage('Parola trebuie să fie formată din cel puțin 5 caractere'),
  ],
  signup
);
router.post('/login', login);
router.patch('/:userId', updateUser);

module.exports = router;

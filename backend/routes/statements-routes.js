const express = require('express');
const { getAllStatements } = require('../controllers/statements-controllers');
const router = express.Router();

router.get('/:userId', getAllStatements);

module.exports = router;

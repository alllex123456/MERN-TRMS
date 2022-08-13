const express = require('express');
const { getStatistics } = require('../controllers/statistics-controllers');
const router = express.Router();

router.get('/:userId', getStatistics);

module.exports = router;

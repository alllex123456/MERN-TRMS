const express = require('express');
const {
  getAllClients,
  getClient,
  addClient,
  modifyClient,
  deleteClient,
} = require('../controllers/clients-controllers');
const router = express.Router();

router.get('/', getAllClients);
router.get('/:clientId', getClient);
router.post('/add-client', addClient);
router.patch('/modify-client', modifyClient);
router.delete('/delete-client', deleteClient);

module.exports = router;

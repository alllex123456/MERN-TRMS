const express = require('express');
const router = express.Router();
const {
  createInvoice,
  generateInvoice,
  sendInvoice,
  getAllInvoices,
  getInvoice,
  modifyInvoice,
  deleteInvoice,
} = require('../controllers/invoice-controllers');
const authGuard = require('../middleware/auth-guard');

router.use(authGuard);

router.get('/', getAllInvoices);
router.get('/:invoiceId', getInvoice);
router.get('/pdf/:invoiceId', generateInvoice);

router.post('/send-invoice', sendInvoice);
router.post('/:clientId', createInvoice);

router.patch('/modify-invoice', modifyInvoice);
router.delete('/delete-invoice/:invoiceId', deleteInvoice);

module.exports = router;
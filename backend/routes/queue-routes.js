const express = require('express');
const router = express.Router();

const {
  getQueueList,
  addQueueOrder,
  completeQueueOrder,
  modifyQueueOrder,
  deleteQueueOrder,
} = require('../controllers/queue-controllers');

router.get('/', getQueueList);
router.post('/add-order', addQueueOrder);
router.post('/complete-order', completeQueueOrder);
router.patch('/modify-order', modifyQueueOrder);
router.delete('/delete-order', deleteQueueOrder);

module.exports = router;

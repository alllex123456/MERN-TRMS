const mongoose = require('mongoose');

const Order = require('../models/order');
const User = require('../models/user');
const Client = require('../models/client');
const HttpError = require('../models/http-error');

exports.getQueueList = async (req, res, next) => {
  const { userId } = req.body;

  let orders;
  try {
    orders = await Order.find({ userId });
  } catch (error) {
    return next(
      new HttpError(
        'A survenit o problemă la interogarea bazei de utilizatori. Vă rugăm să reîncercați.',
        500
      )
    );
  }

  res.json({
    message: orders.map((order) => order.toObject({ getters: true })),
  });
};

exports.addQueueOrder = async (req, res, next) => {
  const { userId, clientId, ref } = req.body;
  const newQueueOrder = new Order({
    ...req.body,
    status: 'queue',
    reference: ref || '-',
  });

  const user = await User.findById(userId);
  const client = await Client.findById(clientId);

  if (!user || !client) {
    return next(
      new HttpError(
        'A survenit o problemă la interogarea bazei de utilizatori. Vă rugăm să reîncercați.',
        500
      )
    );
  }

  user.orders.push(newQueueOrder);
  client.orders.push(newQueueOrder);

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await newQueueOrder.save({ session });
    await user.save({ session });
    await client.save({ session });
    session.commitTransaction();
  } catch (error) {
    return next(
      new HttpError(
        'A survenit o problemă la salvarea comenzii în baza de comenzi. Vă rugăm să reîncercați.',
        500
      )
    );
  }

  res.json({ message: newQueueOrder.toObject({ getters: true }) });
};

exports.completeQueueOrder = async (req, res, next) => {
  const { orderId } = req.body;

  let order;
  try {
    order = await Order.findById(orderId);
  } catch (error) {
    return next(
      new HttpError(
        'A survenit o problemă la accesarea comenzii în baza de comenzi. Vă rugăm să reîncercați.',
        500
      )
    );
  }

  order.status = 'completed';

  try {
    await order.save();
  } catch (error) {
    return next(
      new HttpError(
        'A survenit o problemă la finalizarea comenzii în baza de comenzi. Vă rugăm să reîncercați.',
        500
      )
    );
  }

  res.json({ message: order.toObject({ getters: true }) });
};

exports.modifyQueueOrder = (req, res, next) => {
  const {
    orderId,
    reference,
    rate,
    estimatedCount,
    receivedDate,
    deadline,
    notes,
  } = req.body;

  res.json({ message: 'Order changed' });
};

exports.deleteQueueOrder = (req, res, next) => {
  const { orderId } = req.body;

  res.json({ message: 'Order deleted' });
};

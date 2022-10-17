const mongoose = require('mongoose');

const Order = require('../models/order');
const User = require('../models/user');
const Client = require('../models/client');

const HttpError = require('../models/http-error');

const calculatedTotal = (unit, count, rate) => {
  let total;
  if (unit === '2000cw/s') {
    total = (count / 2000) * rate;
  }
  if (unit === 'word') {
    total = count * rate;
  }
  if (unit === '300w') {
    total = (count / 300) * rate;
  }
  if (unit === '1800cw/os') {
    total = (count / 1800) * rate;
  }
  return total.toFixed(2);
};

exports.getOrders = async (req, res, next) => {
  const orderIds = JSON.parse(req.headers.payload);

  let orders;
  try {
    orders = await Order.find({
      _id: { $in: orderIds },
    });
  } catch (error) {
    return next(
      new HttpError(
        'A survenit o problemă la regasirea comenzilor. Vă rugăm să reîncercați.',
        500
      )
    );
  }

  res.json({
    message: orders.map((order) => order.toObject({ getters: true })),
  });
};

exports.getClientCompletedOrders = async (req, res, next) => {
  const { clientId } = req.params;

  let client;
  try {
    client = await Client.findById(clientId).populate({
      path: 'orders',
      match: { status: 'completed' },
    });
  } catch (error) {
    return next(
      new HttpError(
        'A survenit o problemă la regasirea clientului. Vă rugăm să reîncercați.',
        500
      )
    );
  }

  res.json({
    message: client,
  });
};

exports.getQueueList = async (req, res, next) => {
  const { userId } = req.userData;

  let orders;
  try {
    orders = await Order.find({ userId, status: 'queue' }).populate('clientId');
  } catch (error) {
    return next(
      new HttpError(
        'A survenit o problemă la interogarea bazei de comenzi. Vă rugăm să reîncercați.',
        500
      )
    );
  }

  res.json({
    message: orders
      .sort((a, b) => a.deadline - b.deadline)
      .map((order) => order.toObject({ getters: true })),
  });
};

exports.getOrder = async (req, res, next) => {
  const { orderId } = req.params;

  let order;
  try {
    order = await Order.findById(orderId).populate('clientId');
  } catch (error) {
    return next(
      new HttpError(
        'A survenit o problemă la interogarea bazei de comenzi. Vă rugăm să reîncercați.',
        500
      )
    );
  }

  if (order.userId.toString() !== req.userData.userId) {
    return next(
      new HttpError('Nu există autorizație pentru această operațiune.', 401)
    );
  }

  res.json({ message: order.toObject({ getters: true }) });
};

exports.addOrder = async (req, res, next) => {
  const {
    service,
    clientId,
    ref,
    receivedDate,
    deadline,
    rate,
    unit,
    currency,
    count,
    notes,
  } = req.body;

  const newOrder = new Order({
    userId: req.userData.userId,
    clientId,
    service,
    receivedDate,
    deadline,
    rate,
    unit,
    currency,
    count,
    notes,
    status: req.body.addToStatement ? 'completed' : 'queue',
    reference: ref || '-',
    total: calculatedTotal(unit, count, rate),
  });

  let user, client;
  try {
    user = await User.findById(req.userData.userId);
    client = await Client.findById(clientId);
  } catch (error) {}

  if (!user || !client) {
    return next(
      new HttpError(
        'A survenit o problemă la interogarea bazei de comenzi. Utilizatorul sau clientul nu există. Vă rugăm să reîncercați.',
        500
      )
    );
  }

  user.orders.push(newOrder);
  client.orders.push(newOrder);

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await newOrder.save({ session });
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

  res.json({ message: newOrder.toObject({ getters: true }) });
};

exports.completeOrder = async (req, res, next) => {
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

  if (order.userId.toString() !== req.userData.userId) {
    return next(
      new HttpError('Nu există autorizație pentru această operațiune.', 401)
    );
  }

  order.status = 'completed';
  order.reference = req.body.reference;
  order.rate = req.body.rate;
  order.count = req.body.count;
  order.notes = req.body.notes;
  order.total = calculatedTotal(order.unit, req.body.count, req.body.rate);
  order.deliveredDate = req.body.deliveredDate;

  try {
    await order.save();
  } catch (error) {
    console.log(error);
    return next(
      new HttpError(
        'A survenit o problemă la finalizarea comenzii în baza de comenzi. Vă rugăm să reîncercați.',
        500
      )
    );
  }

  res.json({ message: 'Comanda a fost finalizata cu succes!' });
};

exports.modifyOrder = async (req, res, next) => {
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

  if (order.userId.toString() !== req.userData.userId) {
    return next(
      new HttpError('Nu există autorizație pentru această operațiune.', 401)
    );
  }

  for (const [key, value] of Object.entries(req.body)) {
    if (value) {
      order[key] = value;
    }
  }

  order.total = calculatedTotal(order.unit, req.body.count, req.body.rate);

  try {
    await order.save();
  } catch (error) {
    return next(
      new HttpError(
        'A survenit o problemă la accesarea comenzii în baza de comenzi. Vă rugăm să reîncercați.',
        500
      )
    );
  }

  res.json({ message: 'Comanda a fost modificata cu succes!' });
};

exports.deleteOrder = async (req, res, next) => {
  const { orderId } = req.body;

  let order;
  try {
    order = await Order.findById(orderId).populate('userId clientId');
  } catch (error) {
    return next(
      new HttpError(
        'A survenit o problemă la accesarea comenzii în baza de comenzi. Vă rugăm să reîncercați.',
        500
      )
    );
  }

  if (order.userId.id.toString() !== req.userData.userId) {
    return next(
      new HttpError('Nu există autorizație pentru această operațiune.', 401)
    );
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await order.remove({ session });
    order.userId.orders.pull(order);
    order.clientId.orders.pull(order);
    await order.userId.save({ session });
    await order.clientId.save({ session });
    session.commitTransaction();
  } catch (error) {
    return next(
      new HttpError(
        'A survenit o problemă la ștergerea comenzii în baza de comenzi. Vă rugăm să reîncercați.',
        500
      )
    );
  }

  res.json({ message: 'Comanda a fost stearsa cu succes!' });
};

exports.cleanUpOrders = async (req, res, next) => {
  const { userId } = req.userData;

  let user;
  try {
    user = await User.findById(userId).populate('orders');
  } catch (error) {
    return next(
      new HttpError(
        'A survenit o problemă la gasirea utilizatorului în baza de date. Vă rugăm să reîncercați.',
        500
      )
    );
  }

  user.orders = user.orders.filter(
    (order) =>
      order.status === 'queue' || order.deliveredDate > Date.now() - 31536000000
  );
  await user.save();

  const clients = await Client.find({ userId }).populate('orders');
  clients.forEach(async (client) => {
    client.orders = client.orders.filter(
      (order) =>
        order.status === 'queue' ||
        order.deliveredDate > Date.now() - 31536000000
    );
    await client.save();
  });

  await Order.deleteMany({
    userId,
    deliveredDate: { $lte: Date.now() - 31536000000 },
  });

  next();
};

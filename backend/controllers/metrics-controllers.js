const mongoose = require('mongoose');
const User = require('../models/user');
const Order = require('../models/order');
const Client = require('../models/client');

const HttpError = require('../models/http-error');

exports.getMetrics = async (req, res, next) => {
  const { userId } = req.userData;

  let user, pendingOrders, completedOrders;
  try {
    user = await User.findById(userId).populate('orders');
  } catch (error) {
    return next(
      new HttpError(
        'A survenit o problemă la interogarea bazei de utilizatori (utilizatorul nu a putut fi accesat). Vă rugăm să reîncercați.',
        500
      )
    );
  }

  pendingOrders = user.orders.filter((order) => order.status === 'queue');
  completedOrders = user.orders.filter(
    (order) => order.status === 'completed' || order.status === 'invoiced'
  );

  res.json({
    pendingOrders,
    completedOrders,
  });
};

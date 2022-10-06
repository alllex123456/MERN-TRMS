const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Invoice = require('../models/invoice');
const Client = require('../models/client');
const User = require('../models/user');
const Order = require('../models/order');

const { sendInvoiceScript } = require('../utils/sendInvoiceScript');
const { InvoicePDF } = require('../services/pdf-invoice');

exports.getAllInvoices = async (req, res, next) => {
  let user;
  try {
    user = await User.findById(req.userData.userId).populate({
      path: 'clients',
      populate: {
        path: 'invoices',
      },
    });
  } catch (error) {
    return next(
      new HttpError(
        'A survenit o problemă la interogarea bazei de utilizatori. Vă rugăm să reîncercați.',
        500
      )
    );
  }

  res.json({ message: user });
};

exports.getInvoice = async (req, res, next) => {
  const { invoiceId } = req.params;

  let invoice;
  try {
    invoice = await Invoice.findById(invoiceId).populate('clientId orders');
  } catch (error) {
    return next(
      new HttpError(
        'A survenit o problemă la interogarea bazei de utilizatori. Vă rugăm să reîncercați.',
        500
      )
    );
  }

  res.json({ message: invoice.toObject({ getters: true }) });
};

exports.createInvoice = async (req, res, next) => {
  const { userId } = req.userData;
  const { clientId, orders, dueDate, issuedDate, totalInvoice, remainder } =
    req.body;

  let user;
  try {
    user = await User.findById(userId);
  } catch (error) {
    return next(
      new HttpError(
        'A survenit o problemă la interogarea bazei de utilizatori. Vă rugăm să reîncercați.',
        500
      )
    );
  }

  let client;
  try {
    client = await Client.findById(clientId).populate('orders');
  } catch (error) {
    return next(
      new HttpError(
        'A survenit o problemă la interogarea bazei de clienti. Vă rugăm să reîncercați.',
        500
      )
    );
  }

  if (client.userId.toString() !== req.userData.userId) {
    return next(
      new HttpError('Nu există autorizație pentru această operațiune.', 401)
    );
  }

  if (!user) {
    return next(new HttpError('Utilizatorul nu există.', 404));
  }
  if (!client) {
    return next(new HttpError('Clientul nu există.', 404));
  }

  const newInvoice = new Invoice({
    userId,
    clientId,
    series: user.invoiceSeries,
    number: user.invoiceStartNumber,
    orders,
    dueDate,
    issuedDate,
    totalInvoice,
    remainder,
    cashed: false,
  });

  user.invoices.push(newInvoice);
  client.invoices.push(newInvoice);
  client.remainder += req.body.remainder;
  user.invoiceStartNumber += 1;

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await user.save({ session });
    await client.save({ session });
    await newInvoice.save({ session });
    await Order.updateMany(
      {
        _id: { $in: req.body.orders },
      },
      { $set: { status: 'invoiced', invoiceId: newInvoice._id } }
    );
    session.commitTransaction();
  } catch (error) {
    return next(
      new HttpError(
        'Factura nu a putut fi generata, va rugam sa reincercati',
        401
      )
    );
  }

  res.json({
    message: 'Factura a fost emisa cu succes!',
    invoiceId: newInvoice._id,
  });
};

exports.generateInvoice = async (req, res, next) => {
  const { invoiceId } = req.params;

  let invoice;
  try {
    invoice = await Invoice.findById(invoiceId).populate(
      'orders clientId userId'
    );
  } catch (error) {
    return next(
      new HttpError(
        'A survenit o problemă la interogarea bazei de facturi. Vă rugăm să reîncercați.',
        500
      )
    );
  }

  if (req.userData.userId !== invoice.userId.id) {
    return next(
      new HttpError(
        'Nu exista autorizatie pentru a efectua aceasta operatiune.',
        401
      )
    );
  }

  const totalInvoice = invoice.orders.reduce(
    (acc, val) => (acc += val.total),
    0
  );

  try {
    InvoicePDF(res, invoice, totalInvoice);
  } catch (error) {
    return next(
      new HttpError(
        'A survenit o problemă la generarea fisierului PDF. Vă rugăm să reîncercați.',
        500
      )
    );
  }
};

exports.sendInvoice = async (req, res, next) => {
  const { userId } = req.userData;
  const { invoiceId, clientId, email, message } = req.body;

  let user;
  try {
    user = await User.findById(userId);
  } catch (error) {
    return next(
      new HttpError(
        'A survenit o problemă la interogarea bazei de utilizatori. Vă rugăm să reîncercați.',
        500
      )
    );
  }

  let client;
  try {
    client = await Client.findById(clientId);
  } catch (error) {
    return next(
      new HttpError(
        'A survenit o problemă la interogarea bazei de clienti. Vă rugăm să reîncercați.',
        500
      )
    );
  }

  let invoice;
  try {
    invoice = await Invoice.findById(invoiceId);
  } catch (error) {
    return next(
      new HttpError(
        'A survenit o problemă la interogarea bazei de facturi. Vă rugăm să reîncercați.',
        500
      )
    );
  }

  if (client.userId.toString() !== req.userData.userId) {
    return next(
      new HttpError('Nu există autorizație pentru această operațiune.', 401)
    );
  }

  if (!user) {
    return next(new HttpError('Utilizatorul nu există.', 404));
  }
  if (!client) {
    return next(new HttpError('Clientul nu există.', 404));
  }
  if (!invoice) {
    return next(new HttpError('Factura nu există.', 404));
  }

  const body = {
    message,
    series: invoice.series,
    number: invoiceNumber,
    totalInvoice: invoice.totalInvoice,
    dueDate: invoice.dueDate,
  };

  try {
    sendInvoiceScript(user, client, body, email);
  } catch (error) {
    return next(
      new HttpError(
        'A survenit o problemă la trimiterea mesajului. Vă rugăm să reîncercați.',
        500
      )
    );
  }

  res.json({
    message:
      'Factura a fost trimisa cu succes. Veti primi pe adresa dvs. de email o copie a mesajului trimis.',
  });
};

exports.modifyInvoice = async (req, res, next) => {
  const { ordersEdited, ordersDeleted } = req.body;
  const deletedIds = ordersDeleted.map((order) => order.id);

  let client;
  try {
    client = await Client.findById(req.body.clientId);
  } catch (error) {
    return next(
      new HttpError(
        'A survenit o problemă la interogarea bazei de clienti. Vă rugăm să reîncercați.',
        500
      )
    );
  }

  client.remainder += req.body.remainder;

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    await client.save({ session });

    await User.updateOne(
      { _id: req.userData.userId },
      { $pullAll: { orders: deletedIds } },
      { session }
    );

    await Client.updateOne(
      { _id: req.body.clientId },
      {
        $pullAll: { orders: deletedIds },
      },
      { session }
    );

    await Invoice.updateOne(
      { _id: req.body.invoiceId },
      {
        $set: {
          dueDate: req.body.dueDate,
          issuedDate: req.body.issuedDate,
          totalInvoice: req.body.totalInvoice,
          remainder: req.body.remainder,
        },
        $pullAll: { orders: deletedIds },
      },
      { session }
    );

    for (const order of ordersEdited) {
      await Order.updateOne(
        { _id: order._id },
        {
          $set: {
            reference: order.reference,
            count: order.count,
            rate: order.rate,
            total: order.total,
          },
        },
        { session }
      );
    }

    await Order.deleteMany({ _id: { $in: deletedIds } }, { session });

    session.commitTransaction();
  } catch (error) {
    return next(
      new HttpError(
        'Factura nu a putut fi actualizata, va rugam sa reincercati',
        401
      )
    );
  }

  res.json({ message: 'Factura a fost modificata cu succes!' });
};

exports.deleteInvoice = async (req, res, next) => {
  const { invoiceId } = req.params;
  const { removeOrders } = req.query;

  let invoice;
  try {
    invoice = await Invoice.findById(invoiceId).populate('userId clientId');
  } catch (error) {
    return next(
      new HttpError(
        'Factura nu a putut fi actualizata, va rugam sa reincercati',
        401
      )
    );
  }

  if (!invoice) {
    return next(
      new HttpError(
        'Factura nu a putut fi regasita, va rugam sa reincercati',
        401
      )
    );
  }

  if (invoice.userId.id.toString() !== req.userData.userId) {
    return next(
      new HttpError('Nu există autorizație pentru această operațiune.', 401)
    );
  }

  invoice.userId.invoices.pull(invoice);
  invoice.clientId.invoices.pull(invoice);
  invoice.userId.invoiceStartNumber -= 1;
  invoice.clientId.remainder -= invoice.remainder;

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await invoice.remove({ session });
    await invoice.userId.save({ session });
    await invoice.clientId.save({ session });

    if (removeOrders === 'true') {
      await User.updateOne(
        { _id: invoice.userId },
        { $pullAll: { orders: invoice.orders } },
        { session }
      );
      await Client.updateOne(
        { _id: invoice.clientId },
        { $pullAll: { orders: invoice.orders } },
        { session }
      );
      await Order.deleteMany({ _id: { $in: invoice.orders } }, { session });
    }

    if (removeOrders === 'false') {
      await Order.updateMany(
        { _id: { $in: invoice.orders } },
        { $set: { status: 'completed' } },
        { session }
      );
    }

    session.commitTransaction();
  } catch (error) {
    console.log(error);
    return next(
      new HttpError(
        'A survenit o problemă la anularea facturii. Vă rugăm să reîncercați.',
        500
      )
    );
  }

  res.json({ message: 'Factura a fost anulata!' });
};

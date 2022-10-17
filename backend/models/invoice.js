const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invoiceSchema = new Schema(
  {
    userId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    clientId: { type: mongoose.Types.ObjectId, required: true, ref: 'Client' },
    cashed: { type: Boolean, required: true },
    reversed: { type: Boolean, required: false },
    cashedAmount: { type: Number, required: false },
    dateCashed: { type: Date, required: false },
    series: { type: String, required: true },
    number: { type: Number, required: true },
    orders: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Order' }],
    totalInvoice: { type: Number, required: true },
    remainder: { type: Number, required: true },
    issuedDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Invoice', invoiceSchema);

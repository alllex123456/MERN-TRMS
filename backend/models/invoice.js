const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invoiceSchema = new Schema(
  {
    userId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    clientId: { type: mongoose.Types.ObjectId, required: true, ref: 'Client' },
    cashed: { type: Boolean, required: true },
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

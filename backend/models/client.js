const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const clientSchema = new Schema(
  {
    userId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    orders: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Order' }],
    name: { type: String, required: true },
    rate: { type: Number, required: true },
    unit: { type: String, required: true },
    currency: { type: String, required: true },
    email: { type: String, required: false },
    phone: { type: String, required: false },
    registeredOffice: { type: String, required: false },
    registrationNumber: { type: String, required: false },
    taxNumber: { type: String, required: false },
    bank: { type: String, required: false },
    iban: { type: String, required: false },
    notes: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Client', clientSchema);

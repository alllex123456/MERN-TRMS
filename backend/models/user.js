const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    alias: { type: String, required: false },
    name: { type: String, required: false },
    language: { type: String, required: false },
    theme: { type: String, required: false },
    phone: { type: String, required: false },
    registeredOffice: { type: String, required: false },
    registrationNumber: { type: String, required: false },
    taxNumber: { type: String, required: false },
    bank: { type: String, required: false },
    iban: { type: String, required: false },
    clients: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Client' }],
    orders: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Order' }],
  },
  { timestamps: true }
);

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);

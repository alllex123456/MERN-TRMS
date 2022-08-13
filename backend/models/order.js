const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    userId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    clientId: { type: mongoose.Types.ObjectId, required: true, ref: 'Client' },
    status: { type: String, required: true },
    rate: { type: Number, required: true },
    estimatedCount: { type: String, required: true },
    receivedDate: { type: Date, required: true },
    deadline: { type: Date, required: true },
    reference: { type: String, required: false },
    notes: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);

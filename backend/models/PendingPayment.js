const mongoose = require('mongoose');

const pendingPaymentSchema = new mongoose.Schema({
  razorpayOrderId: { type: String, required: true, unique: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    size: String,
    color: String
  }],
  shippingAddress: {
    name: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    phone: String,
  },
  calculatedAmount: { type: Number, required: true }, // in rupees
  status: { type: String, enum: ['pending', 'completed', 'expired'], default: 'pending' },
  completedOrderId: { type: String, default: null }, // links to the final RedSee Order _id for idempotency
  createdAt: { type: Date, default: Date.now, expires: 7200 } // TTL: auto-delete after 2 hours
});

module.exports = mongoose.model('PendingPayment', pendingPaymentSchema);

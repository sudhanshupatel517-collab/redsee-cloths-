const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: false, unique: true, sparse: true },
  phone: { type: String, required: false, unique: true, sparse: true },
  password: { type: String, required: function() { return this.authProvider === 'email'; } },
  authProvider: { type: String, enum: ['google', 'phone', 'email'], default: 'email' },
  avatar: { type: String },
  isVerified: { type: Boolean, default: false },
  emailOtp: { type: String },
  otpExpire: { type: Date },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  role: { type: String, enum: ['user', 'coadmin', 'admin'], default: 'user' },
  addresses: [{
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    phone: String,
  }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  cart: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 },
    size: String,
    color: String
  }],
  orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

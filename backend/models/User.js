const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: false },
  name: { type: String, required: true },
  email: { type: String, required: false, unique: true, sparse: true },
  phone: { type: String, required: false, unique: true, sparse: true },
  password: { type: String, required: false },
  hasPassword: { type: Boolean, default: false },
  authProvider: { type: String, enum: ['google', 'phone', 'email'], default: 'email' },
  avatar: { type: String },
  isVerified: { type: Boolean, default: false },
  emailOtp: { type: String },
  otpExpire: { type: Date },
  tempPassword: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  role: { type: String, enum: ['user', 'coadmin', 'admin'], default: 'user' },
  permissions: [{ type: String, enum: ['manage_products', 'manage_inventory', 'manage_orders', 'manage_discounts', 'manage_support', 'manage_categories', 'manage_banners', 'manage_events', 'manage_studio'] }],
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
  rewards: { type: Number, default: 0 },
  orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  recentlyViewed: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    viewedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

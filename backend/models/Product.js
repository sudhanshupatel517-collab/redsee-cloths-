const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  price: { type: Number, required: true },
  discountedPrice: { type: Number },
  category: { type: String, required: true, index: true },
  sizes: [{ type: String }],
  colors: [{ type: String }],
  stock: { type: Number, required: true, default: 0 },
  ratings: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  supplier: { type: String },
  shippingInfo: {
    weight: Number,
    dimensions: { length: Number, width: Number, height: Number }
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

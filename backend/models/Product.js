const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  size: { type: String, required: true },
  color: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  brand: { type: String, default: 'Redsee' },
  
  pricing: {
    originalPrice: { type: Number, required: true },
    discountPercentage: { type: Number, default: 0 },
    finalPrice: { type: Number, required: true }
  },

  variants: [variantSchema],
  
  images: [{ type: String }],
  tags: [{ type: String }],
  
  inventoryStatus: {
    type: String,
    enum: ['In Stock', 'Low Stock', 'Out of Stock'],
    default: 'In Stock'
  },
  
  featured: { type: Boolean, default: false },
  published: { type: Boolean, default: true },
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

// Pre-save hook to calculate finalPrice and inventoryStatus
productSchema.pre('save', function(next) {
  // Auto-calculate final price
  if (this.pricing.originalPrice && this.pricing.discountPercentage >= 0) {
    const discountAmount = (this.pricing.originalPrice * this.pricing.discountPercentage) / 100;
    this.pricing.finalPrice = Math.round(this.pricing.originalPrice - discountAmount);
  }

  // Auto-calculate inventory status based on variants stock
  if (this.variants && this.variants.length > 0) {
    const totalStock = this.variants.reduce((acc, variant) => acc + variant.stock, 0);
    if (totalStock <= 0) {
      this.inventoryStatus = 'Out of Stock';
    } else if (totalStock <= 10) {
      this.inventoryStatus = 'Low Stock';
    } else {
      this.inventoryStatus = 'In Stock';
    }
  }

  next();
});

module.exports = mongoose.model('Product', productSchema);

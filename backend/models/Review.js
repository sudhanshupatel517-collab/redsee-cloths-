const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  userName: { type: String, required: true },
  userProfileImage: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  reviewTitle: { type: String },
  reviewDescription: { type: String, required: true },
  reviewImages: [{ type: String }],
  reviewVideos: [{ type: String }],
  isVerifiedPurchase: { type: Boolean, default: true },
  isHidden: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  isPinned: { type: Boolean, default: false },
  isResolved: { type: Boolean, default: false },
  adminReply: {
    message: String,
    repliedAt: Date,
    repliedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }
}, { timestamps: true });

// Index for performance
reviewSchema.index({ productId: 1, isHidden: 1, isPinned: -1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);

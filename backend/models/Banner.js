const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: [true, 'Please add an image URL'],
    },
    linkUrl: {
      type: String,
      default: '/shop',
    },
    title: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;

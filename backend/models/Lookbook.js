const mongoose = require('mongoose');

const lookbookSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: [true, 'Please add an image URL'],
    },
    chapter: {
      type: String,
      required: [true, 'Please add a chapter (e.g. CHAPTER 01)'],
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    span: {
      type: String,
      required: [true, 'Please specify layout span class'],
      default: 'col-span-1 row-span-1 md:h-[217px]',
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

const Lookbook = mongoose.model('Lookbook', lookbookSchema);

module.exports = Lookbook;

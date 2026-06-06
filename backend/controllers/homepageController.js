const Product = require('../models/Product');
const Banner = require('../models/Banner');
const Category = require('../models/Category');

// @desc    Get aggregated homepage data
// @route   GET /api/homepage
// @access  Public
const getHomepageData = async (req, res) => {
  try {
    const now = new Date();
    // Run all database queries concurrently for maximum performance
    const [
      banners,
      justDropped,
      trendingNow,
      bestSellers,
      mensProducts,
      womensProducts,
      limitedDrops,
      offersForYou,
      newArrivals,
      categories
    ] = await Promise.all([
      Banner.find({
        isActive: true,
        $and: [
          { $or: [{ startDate: null }, { startDate: { $lte: now } }] },
          { $or: [{ endDate: null }, { endDate: { $gte: now } }] }
        ]
      }).sort({ order: 1 }),
      Product.find({ published: true }).sort({ createdAt: -1 }).limit(8),
      Product.find({ published: true }).sort({ updatedAt: -1 }).limit(8),
      Product.find({ published: true, featured: true }).limit(8),
      Product.find({ published: true, category: { $regex: /\bmen/i } }).sort({ createdAt: -1 }).limit(8),
      Product.find({ published: true, category: { $regex: /women/i } }).sort({ createdAt: -1 }).limit(8),
      Product.find({ published: true }).sort({ createdAt: 1 }).limit(8),
      Product.find({ published: true, 'pricing.discountPercentage': { $gt: 0 } }).sort({ 'pricing.discountPercentage': -1 }).limit(8),
      Product.find({ published: true }).sort({ createdAt: -1 }).skip(2).limit(8),
      Category.find({ isActive: true }).sort({ order: 1 })
    ]);

    res.json({
      banners,
      justDropped,
      trendingNow,
      bestSellers,
      mensCollection: mensProducts,
      womensCollection: womensProducts,
      limitedDrops,
      offersForYou,
      newArrivals,
      categories
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching homepage data', error: error.message });
  }
};

module.exports = {
  getHomepageData
};

const Product = require('../models/Product');
const Banner = require('../models/Banner');
const Category = require('../models/Category');
const Lookbook = require('../models/Lookbook');

// @desc    Get aggregated homepage data
// @route   GET /api/homepage
// @access  Public
const getHomepageData = async (req, res) => {
  try {
    const now = new Date();
    const sectionParam = req.query.section || 'Men';

    const productFilter = {
      published: true,
      section: { $regex: `^${sectionParam}$`, $options: 'i' }
    };

    // Run all database queries concurrently for maximum performance
    const [
      banners,
      justDropped,
      trendingNow,
      bestSellers,
      mensProducts,
      womensProducts,
      accessoriesProducts,
      limitedDrops,
      offersForYou,
      newArrivals,
      categories,
      lookbook
    ] = await Promise.all([
      Banner.find({
        isActive: true,
        $and: [
          { $or: [{ startDate: null }, { startDate: { $lte: now } }] },
          { $or: [{ endDate: null }, { endDate: { $gte: now } }] }
        ]
      }).sort({ order: 1 }),
      Product.find(productFilter).sort({ createdAt: -1 }).limit(8),
      Product.find(productFilter).sort({ clicks: -1 }).limit(8),
      Product.find(productFilter).sort({ salesCount: -1 }).limit(8),
      Product.find({ published: true, section: 'Men' }).sort({ createdAt: -1 }).limit(8),
      Product.find({ published: true, section: 'Women' }).sort({ createdAt: -1 }).limit(8),
      Product.find({ published: true, section: 'Accessories' }).sort({ createdAt: -1 }).limit(8),
      Product.find({ ...productFilter, totalStock: { $gt: 0 } }).sort({ totalStock: 1 }).limit(8),
      Product.find({ ...productFilter, 'pricing.discountPercentage': { $gt: 0 } }).sort({ 'pricing.discountPercentage': -1 }).limit(8),
      Product.find(productFilter).sort({ createdAt: -1 }).limit(8),
      Category.find({ isActive: true }).sort({ order: 1 }),
      Lookbook.find({ isActive: true }).sort({ order: 1 })
    ]);

    res.json({
      banners,
      justDropped,
      trendingNow,
      bestSellers,
      mensCollection: mensProducts,
      womensCollection: womensProducts,
      accessoriesCollection: accessoriesProducts,
      limitedDrops,
      offersForYou,
      newArrivals,
      categories,
      lookbook
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching homepage data', error: error.message });
  }
};

module.exports = {
  getHomepageData
};

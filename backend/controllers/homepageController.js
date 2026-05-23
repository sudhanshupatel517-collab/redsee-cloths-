const Product = require('../models/Product');
const Banner = require('../models/Banner');
const Category = require('../models/Category');

// @desc    Get aggregated homepage data
// @route   GET /api/homepage
// @access  Public
const getHomepageData = async (req, res) => {
  try {
    // Run all database queries concurrently for maximum performance
    const [banners, latestProducts, featuredProducts, categories, mensProducts, womensProducts] = await Promise.all([
      Banner.find({ isActive: true }).sort({ order: 1 }),
      Product.find({ published: true }).sort({ createdAt: -1 }).limit(10),
      Product.find({ published: true, featured: true }).limit(6),
      Category.find({ isActive: true }).sort({ order: 1 }),
      Product.find({ published: true, category: { $regex: /men/i } }).sort({ createdAt: -1 }).limit(6),
      Product.find({ published: true, category: { $regex: /women/i } }).sort({ createdAt: -1 }).limit(6)
    ]);

    res.json({
      banners,
      latestProducts,
      featuredProducts,
      categories,
      mensProducts,
      womensProducts,
      offers: [] // Placeholder for future offers model
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching homepage data', error: error.message });
  }
};

module.exports = {
  getHomepageData
};

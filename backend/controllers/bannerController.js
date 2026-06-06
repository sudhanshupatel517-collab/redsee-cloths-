const Banner = require('../models/Banner');

// @desc    Get all active banners
// @route   GET /api/banners
// @access  Public
const getBanners = async (req, res) => {
  try {
    const now = new Date();
    const banners = await Banner.find({
      isActive: true,
      $and: [
        { $or: [{ startDate: null }, { startDate: { $lte: now } }] },
        { $or: [{ endDate: null }, { endDate: { $gte: now } }] }
      ]
    }).sort({ order: 1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all banners (including inactive)
// @route   GET /api/banners/all
// @access  Private/Admin
const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find({}).sort({ order: 1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a banner
// @route   POST /api/banners
// @access  Private/Admin
const createBanner = async (req, res) => {
  try {
    const { imageUrl, linkUrl, title, description, isActive, order, startDate, endDate } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ message: 'Image URL is required' });
    }

    const banner = new Banner({
      imageUrl,
      linkUrl,
      title,
      description,
      isActive,
      order,
      startDate: startDate || null,
      endDate: endDate || null,
    });

    const createdBanner = await banner.save();
    res.status(201).json(createdBanner);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a banner
// @route   PUT /api/banners/:id
// @access  Private/Admin
const updateBanner = async (req, res) => {
  try {
    const { imageUrl, linkUrl, title, description, isActive, order, startDate, endDate } = req.body;

    const banner = await Banner.findById(req.params.id);

    if (banner) {
      banner.imageUrl = imageUrl || banner.imageUrl;
      banner.linkUrl = linkUrl !== undefined ? linkUrl : banner.linkUrl;
      banner.title = title !== undefined ? title : banner.title;
      banner.description = description !== undefined ? description : banner.description;
      banner.isActive = isActive !== undefined ? isActive : banner.isActive;
      banner.order = order !== undefined ? order : banner.order;
      banner.startDate = startDate !== undefined ? (startDate || null) : banner.startDate;
      banner.endDate = endDate !== undefined ? (endDate || null) : banner.endDate;

      const updatedBanner = await banner.save();
      res.json(updatedBanner);
    } else {
      res.status(404).json({ message: 'Banner not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (banner) {
      await banner.deleteOne();
      res.json({ message: 'Banner removed' });
    } else {
      res.status(404).json({ message: 'Banner not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getBanners,
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
};

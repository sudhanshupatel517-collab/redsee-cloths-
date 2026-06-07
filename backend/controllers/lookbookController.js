const Lookbook = require('../models/Lookbook');

// @desc    Get all active lookbook items
// @route   GET /api/studio
// @access  Public
const getLookbook = async (req, res) => {
  try {
    const items = await Lookbook.find({ isActive: true }).sort({ order: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching lookbook' });
  }
};

// @desc    Get all lookbook items (including inactive)
// @route   GET /api/studio/all
// @access  Private/Coadmin
const getAllLookbookItems = async (req, res) => {
  try {
    const items = await Lookbook.find({}).sort({ order: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching all lookbook items' });
  }
};

// @desc    Create a lookbook item
// @route   POST /api/studio
// @access  Private/Coadmin
const createLookbookItem = async (req, res) => {
  try {
    const { imageUrl, chapter, title, span, isActive, order } = req.body;

    if (!imageUrl || !chapter || !title) {
      return res.status(400).json({ message: 'imageUrl, chapter and title are required' });
    }

    const item = new Lookbook({
      imageUrl,
      chapter,
      title,
      span: span || 'col-span-1 row-span-1 md:h-[217px]',
      isActive: isActive !== undefined ? isActive : true,
      order: order !== undefined ? order : 0,
    });

    const createdItem = await item.save();
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(500).json({ message: 'Server Error creating lookbook item', error: error.message });
  }
};

// @desc    Update a lookbook item
// @route   PUT /api/studio/:id
// @access  Private/Coadmin
const updateLookbookItem = async (req, res) => {
  try {
    const { imageUrl, chapter, title, span, isActive, order } = req.body;

    const item = await Lookbook.findById(req.params.id);

    if (item) {
      item.imageUrl = imageUrl !== undefined ? imageUrl : item.imageUrl;
      item.chapter = chapter !== undefined ? chapter : item.chapter;
      item.title = title !== undefined ? title : item.title;
      item.span = span !== undefined ? span : item.span;
      item.isActive = isActive !== undefined ? isActive : item.isActive;
      item.order = order !== undefined ? order : item.order;

      const updatedItem = await item.save();
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: 'Lookbook item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error updating lookbook item', error: error.message });
  }
};

// @desc    Delete a lookbook item
// @route   DELETE /api/studio/:id
// @access  Private/Coadmin
const deleteLookbookItem = async (req, res) => {
  try {
    const item = await Lookbook.findById(req.params.id);

    if (item) {
      await item.deleteOne();
      res.json({ message: 'Lookbook item removed' });
    } else {
      res.status(404).json({ message: 'Lookbook item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error deleting lookbook item', error: error.message });
  }
};

module.exports = {
  getLookbook,
  getAllLookbookItems,
  createLookbookItem,
  updateLookbookItem,
  deleteLookbookItem,
};

const Category = require('../models/Category');

// @desc    Get all active categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ order: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching categories', error: error.message });
  }
};

// @desc    Get all categories for admin
// @route   GET /api/categories/admin
// @access  Private/Admin
const getAdminCategories = async (req, res) => {
  try {
    const categories = await Category.find({})
      .populate('parentCategory', 'name slug')
      .sort({ order: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching admin categories' });
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  try {
    const { name, imageUrl, isActive, order, section, parentCategory } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    let baseSlug = name.toLowerCase().replace(/[\s_]/g, '-').replace(/[^\w-]+/g, '');
    let slug = baseSlug;
    if (section && (!parentCategory || parentCategory === '')) {
      slug = `${baseSlug}-${section.toLowerCase()}`;
    }

    const categoryExists = await Category.findOne({ slug });
    if (categoryExists) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = new Category({
      name,
      slug,
      section,
      parentCategory: parentCategory || null,
      imageUrl: imageUrl || '',
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0,
    });

    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    res.status(500).json({ message: 'Server Error creating category', error: error.message });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
  try {
    const { name, imageUrl, isActive, order, section, parentCategory } = req.body;

    const category = await Category.findById(req.params.id);

    if (category) {
      if (name || section || parentCategory !== undefined) {
        const targetName = name || category.name;
        const targetSection = section || category.section;
        const targetParent = parentCategory !== undefined ? parentCategory : category.parentCategory;
        
        let baseSlug = targetName.toLowerCase().replace(/[\s_]/g, '-').replace(/[^\w-]+/g, '');
        if (targetSection && (!targetParent || targetParent === '')) {
          category.slug = `${baseSlug}-${targetSection.toLowerCase()}`;
        } else {
          category.slug = baseSlug;
        }
        category.name = targetName;
      }
      category.section = section !== undefined ? section : category.section;
      category.parentCategory = parentCategory !== undefined ? (parentCategory || null) : category.parentCategory;
      category.imageUrl = imageUrl !== undefined ? imageUrl : category.imageUrl;
      category.isActive = isActive !== undefined ? isActive : category.isActive;
      category.order = order !== undefined ? order : category.order;

      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error updating category' });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (category) {
      await category.deleteOne();
      res.json({ message: 'Category removed' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error deleting category' });
  }
};

module.exports = {
  getCategories,
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};

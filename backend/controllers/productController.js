const Product = require('../models/Product');

// @desc    Fetch all products (with search/filter support)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? {
          $or: [
            { name: { $regex: req.query.keyword, $options: "i" } },
            { category: { $regex: req.query.keyword, $options: "i" } },
            { navbarCategory: { $regex: req.query.keyword, $options: "i" } },
            { tags: { $in: [new RegExp(req.query.keyword, "i")] } }
          ]
        }
      : {};

    const category = req.query.category 
      ? { 
          $or: [
            { category: { $regex: req.query.category, $options: "i" } }, 
            { navbarCategory: { $regex: req.query.category, $options: "i" } }
          ] 
        } 
      : {};

    const section = req.query.section ? { section: { $regex: `^${req.query.section}$`, $options: "i" } } : {};
    const banner = req.query.banner ? { bannerId: req.query.banner } : {};

    const products = await Product.find({ ...keyword, ...category, ...section, ...banner, published: true }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching products', error: error.message });
  }
};

// @desc    Fetch all products for Admin (includes unpublished)
// @route   GET /api/products/admin
// @access  Private/Admin
const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching admin products', error: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching product', error: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      section,
      navbarCategory,
      bannerId,
      brand,
      pricing,
      variants,
      images,
      tags,
      featured,
      published,
    } = req.body;

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[\s_]/g, '-').replace(/[^\w-]+/g, '');

    const product = new Product({
      name,
      slug,
      description,
      category,
      section: section || 'Men',
      navbarCategory: navbarCategory || '',
      bannerId: bannerId || null,
      brand: brand || 'Redsee',
      pricing,
      variants,
      images,
      tags,
      featured,
      published,
      createdBy: req.user._id,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server Error creating product', error: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      section,
      navbarCategory,
      bannerId,
      brand,
      pricing,
      variants,
      images,
      tags,
      featured,
      published,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      if (name) {
         product.slug = name.toLowerCase().replace(/[\s_]/g, '-').replace(/[^\w-]+/g, '');
      }
      product.description = description || product.description;
      product.category = category || product.category;
      product.section = section || product.section;
      product.navbarCategory = navbarCategory !== undefined ? navbarCategory : product.navbarCategory;
      product.bannerId = bannerId !== undefined ? (bannerId || null) : product.bannerId;
      product.brand = brand || product.brand;
      product.pricing = pricing || product.pricing;
      product.variants = variants || product.variants;
      product.images = images || product.images;
      product.tags = tags || product.tags;
      product.featured = featured !== undefined ? featured : product.featured;
      product.published = published !== undefined ? published : product.published;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error updating product', error: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      // Remove images from Cloudinary before deleting product
      if (product.images && product.images.length > 0) {
        const cloudinary = require('../config/cloudinary');
        for (const img of product.images) {
          if (img && typeof img === 'object' && img.public_id) {
            try {
              await cloudinary.uploader.destroy(img.public_id);
            } catch (cloudErr) {
              console.error(`Failed to delete image ${img.public_id} from Cloudinary:`, cloudErr);
            }
          }
        }
      }

      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error deleting product', error: error.message });
  }
};

// @desc    Get batch products by IDs
// @route   POST /api/products/batch
// @access  Public
const getProductsBatch = async (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids)) {
    return res.status(400).json({ message: 'Product IDs array is required' });
  }
  try {
    const products = await Product.find({ _id: { $in: ids }, published: true });
    // Map them to preserve requested order
    const idMap = new Map(products.map(p => [p._id.toString(), p]));
    const sortedProducts = ids
      .map(id => idMap.get(id.toString()))
      .filter(p => p != null);

    res.json(sortedProducts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching batch products', error: error.message });
  }
};

// @desc    Delete all seeded products (where createdBy does not exist)
// @route   DELETE /api/products/seed
// @access  Private/Admin
const deleteSeedProducts = async (req, res) => {
  try {
    const result = await Product.deleteMany({ createdBy: { $exists: false } });
    res.json({ message: `Successfully deleted ${result.deletedCount} seed products.` });
  } catch (error) {
    res.status(500).json({ message: 'Server Error deleting seed products', error: error.message });
  }
};

module.exports = {
  getProducts,
  getAdminProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsBatch,
  deleteSeedProducts,
};

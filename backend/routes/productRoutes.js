const express = require('express');
const router = express.Router();
const {
  getProducts,
  getAdminProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, coadmin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getProducts)
  .post(protect, coadmin, createProduct);

router.route('/admin')
  .get(protect, coadmin, getAdminProducts);

router.route('/:id')
  .get(getProductById)
  .put(protect, coadmin, updateProduct)
  .delete(protect, coadmin, deleteProduct);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getProducts,
  getAdminProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsBatch,
  deleteSeedProducts,
} = require('../controllers/productController');
const { createReview, getProductReviews } = require('../controllers/reviewController');
const { protect, coadmin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getProducts)
  .post(protect, coadmin, createProduct);

router.route('/seed')
  .delete(protect, coadmin, deleteSeedProducts);

router.route('/admin')
  .get(protect, coadmin, getAdminProducts);

router.route('/batch')
  .post(getProductsBatch);

router.route('/:id/reviews')
  .get(getProductReviews)
  .post(protect, createReview);

router.route('/:id')
  .get(getProductById)
  .put(protect, coadmin, updateProduct)
  .delete(protect, coadmin, deleteProduct);

module.exports = router;

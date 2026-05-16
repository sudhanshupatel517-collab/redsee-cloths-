const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct } = require('../controllers/productController');
const { protect, admin, coadmin } = require('../middleware/authMiddleware');

router.route('/').get(getProducts).post(protect, coadmin, createProduct);
router.route('/:id').get(getProductById);

module.exports = router;

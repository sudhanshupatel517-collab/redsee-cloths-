const express = require('express');
const {
  getCategories,
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect, coadmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(getCategories).post(protect, coadmin, createCategory);
router.route('/admin').get(protect, coadmin, getAdminCategories);
router.route('/:id').put(protect, coadmin, updateCategory).delete(protect, coadmin, deleteCategory);

module.exports = router;

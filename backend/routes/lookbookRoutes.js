const express = require('express');
const {
  getLookbook,
  getAllLookbookItems,
  createLookbookItem,
  updateLookbookItem,
  deleteLookbookItem,
} = require('../controllers/lookbookController');
const { protect, requirePermission } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getLookbook)
  .post(protect, requirePermission('manage_studio'), createLookbookItem);

router.route('/all')
  .get(protect, requirePermission('manage_studio'), getAllLookbookItems);

router.route('/:id')
  .put(protect, requirePermission('manage_studio'), updateLookbookItem)
  .delete(protect, requirePermission('manage_studio'), deleteLookbookItem);

module.exports = router;

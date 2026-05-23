const express = require('express');
const {
  getBanners,
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} = require('../controllers/bannerController.js');
const { protect, admin } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.route('/').get(getBanners).post(protect, admin, createBanner);
router.route('/all').get(protect, admin, getAllBanners);
router.route('/:id').put(protect, admin, updateBanner).delete(protect, admin, deleteBanner);

module.exports = router;

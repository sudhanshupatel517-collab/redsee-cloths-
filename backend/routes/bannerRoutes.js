const express = require('express');
const {
  getBanners,
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} = require('../controllers/bannerController.js');
const { protect, coadmin } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.route('/').get(getBanners).post(protect, coadmin, createBanner);
router.route('/all').get(protect, coadmin, getAllBanners);
router.route('/:id').put(protect, coadmin, updateBanner).delete(protect, coadmin, deleteBanner);

module.exports = router;

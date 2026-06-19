const express = require('express');
const router = express.Router();
const { getDashboardStats, getCoAdmins, createCoAdmin, updateCoAdmin, deleteCoAdmin } = require('../controllers/adminController');
const { protect, admin, coadmin } = require('../middleware/authMiddleware');

const { 
  getAllReviewsAdmin, 
  replyToReview, 
  toggleHideReview, 
  toggleFeatureReview, 
  togglePinReview, 
  resolveReview, 
  deleteReview 
} = require('../controllers/reviewController');

router.route('/stats').get(protect, coadmin, getDashboardStats);

router.route('/coadmins')
  .get(protect, admin, getCoAdmins)
  .post(protect, admin, createCoAdmin);

router.route('/coadmins/:id')
  .put(protect, admin, updateCoAdmin)
  .delete(protect, admin, deleteCoAdmin);

// Admin Review Routes
router.route('/reviews')
  .get(protect, coadmin, getAllReviewsAdmin);

router.route('/reviews/:id')
  .delete(protect, coadmin, deleteReview);

router.route('/reviews/:id/reply')
  .put(protect, coadmin, replyToReview);

router.route('/reviews/:id/toggle-hide')
  .put(protect, coadmin, toggleHideReview);

router.route('/reviews/:id/toggle-feature')
  .put(protect, coadmin, toggleFeatureReview);

router.route('/reviews/:id/toggle-pin')
  .put(protect, coadmin, togglePinReview);

router.route('/reviews/:id/resolve')
  .put(protect, coadmin, resolveReview);

module.exports = router;

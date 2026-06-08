const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile,
  addRecentlyViewed,
  getRecentlyViewed,
  mergeRecentlyViewed,
  toggleWishlist,
  getWishlist,
  mergeWishlist,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Address Routes
router.route('/addresses')
  .get(protect, getAddresses)
  .post(protect, addAddress);
router.route('/addresses/:addressId')
  .put(protect, updateAddress)
  .delete(protect, deleteAddress);

// Recently Viewed Product Routes
router.post('/recently-viewed', protect, addRecentlyViewed);
router.get('/recently-viewed', protect, getRecentlyViewed);
router.post('/recently-viewed/merge', protect, mergeRecentlyViewed);

// Wishlist Routes
router.post('/wishlist', protect, toggleWishlist);
router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/merge', protect, mergeWishlist);

module.exports = router;

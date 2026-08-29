const express = require('express');
const router = express.Router();
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
  getKey,
  handleWebhook,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// Protected routes (require authentication)
router.post('/create-order', protect, createRazorpayOrder);
router.post('/verify', protect, verifyRazorpayPayment);
router.get('/key', protect, getKey);

// Webhook — no auth middleware (verified via Razorpay signature in controller)
router.post('/webhook', handleWebhook);

module.exports = router;

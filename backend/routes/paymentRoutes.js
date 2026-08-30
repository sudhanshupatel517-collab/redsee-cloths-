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

// Temporary debug route — check if Razorpay env vars are loaded (remove after debugging)
router.get('/debug-env', (req, res) => {
  res.json({
    RAZORPAY_KEY_ID_exists: !!process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_ID_length: (process.env.RAZORPAY_KEY_ID || '').length,
    RAZORPAY_KEY_SECRET_exists: !!process.env.RAZORPAY_KEY_SECRET,
    RAZORPAY_KEY_SECRET_length: (process.env.RAZORPAY_KEY_SECRET || '').length,
    NODE_ENV: process.env.NODE_ENV,
  });
});

module.exports = router;

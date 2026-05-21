const express = require('express');
const router = express.Router();
const { googleLogin, googleSignup, sendEmailOtp, verifyEmailOtp, login, logout, sendPasswordOtp, verifyPasswordSetup } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/google', googleLogin);
router.post('/google-signup', googleSignup);
router.post('/send-email-otp', sendEmailOtp);
router.post('/verify-email-otp', verifyEmailOtp);
router.post('/login', login);
router.post('/logout', logout);

router.post('/send-password-otp', protect, sendPasswordOtp);
router.post('/verify-password-setup', protect, verifyPasswordSetup);

module.exports = router;

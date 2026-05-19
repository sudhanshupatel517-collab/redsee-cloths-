const express = require('express');
const router = express.Router();
const { googleLogin, googleSignup, sendEmailOtp, verifyEmailOtp, login, logout } = require('../controllers/authController');

router.post('/google', googleLogin);
router.post('/google-signup', googleSignup);
router.post('/send-email-otp', sendEmailOtp);
router.post('/verify-email-otp', verifyEmailOtp);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;

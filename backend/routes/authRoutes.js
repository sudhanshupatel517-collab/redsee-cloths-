const express = require('express');
const router = express.Router();
const { googleLogin, sendEmailOtp, verifyEmailOtp, login, logout } = require('../controllers/authController');

router.post('/google', googleLogin);
router.post('/send-email-otp', sendEmailOtp);
router.post('/verify-email-otp', verifyEmailOtp);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;

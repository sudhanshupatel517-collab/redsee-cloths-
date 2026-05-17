const express = require('express');
const router = express.Router();
const { googleLogin, phoneLogin, signup, login, logout } = require('../controllers/authController');

router.post('/google', googleLogin);
router.post('/phone', phoneLogin);
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;

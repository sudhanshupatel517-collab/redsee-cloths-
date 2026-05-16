const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/adminController');
const { protect, admin, coadmin } = require('../middleware/authMiddleware');

router.route('/stats').get(protect, coadmin, getDashboardStats);

module.exports = router;

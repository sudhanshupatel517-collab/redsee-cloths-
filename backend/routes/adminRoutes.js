const express = require('express');
const router = express.Router();
const { getDashboardStats, getCoAdmins, createCoAdmin, updateCoAdmin, deleteCoAdmin } = require('../controllers/adminController');
const { protect, admin, coadmin } = require('../middleware/authMiddleware');

router.route('/stats').get(protect, coadmin, getDashboardStats);

router.route('/coadmins')
  .get(protect, admin, getCoAdmins)
  .post(protect, admin, createCoAdmin);

router.route('/coadmins/:id')
  .put(protect, admin, updateCoAdmin)
  .delete(protect, admin, deleteCoAdmin);

module.exports = router;

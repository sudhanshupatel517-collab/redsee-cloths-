const express = require('express');
const {
  getEvents,
  getAdminEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');
const { protect, coadmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(getEvents).post(protect, coadmin, createEvent);
router.route('/admin').get(protect, coadmin, getAdminEvents);
router.route('/:id').put(protect, coadmin, updateEvent).delete(protect, coadmin, deleteEvent);

module.exports = router;

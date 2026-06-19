const express = require('express');
const router = express.Router();
const { 
  createTicket, 
  getCustomerTickets, 
  getTicketById, 
  addMessageToTicket, 
  closeTicket, 
  rateSupportExperience, 
  getAllTicketsAdmin, 
  updateTicketAdmin, 
  addInternalNote 
} = require('../controllers/ticketController');
const { protect, coadmin } = require('../middleware/authMiddleware');

// Customer Routes
router.route('/')
  .post(protect, createTicket)
  .get(protect, getCustomerTickets);

router.route('/:id')
  .get(protect, getTicketById);

router.route('/:id/messages')
  .post(protect, addMessageToTicket);

router.route('/:id/close')
  .put(protect, closeTicket);

router.route('/:id/rate')
  .put(protect, rateSupportExperience);

// Admin / Co-admin Support Operations
router.route('/admin/all')
  .get(protect, coadmin, getAllTicketsAdmin);

router.route('/admin/:id')
  .put(protect, coadmin, updateTicketAdmin);

router.route('/admin/:id/notes')
  .post(protect, coadmin, addInternalNote);

module.exports = router;

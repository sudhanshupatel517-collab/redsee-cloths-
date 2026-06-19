const Ticket = require('../models/Ticket');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const emitRealTimeUpdate = (req, roomId, event, data) => {
  const io = req.app.get('socketio');
  if (io) {
    io.to(roomId).emit(event, data);
  }
};

// @desc    Create a new support ticket
// @route   POST /api/tickets
// @access  Private (Customer)
const createTicket = async (req, res) => {
  const { subject, category, description, orderId, attachments, priority } = req.body;
  const userId = req.user._id;

  try {
    const ticket = await Ticket.create({
      userId,
      orderId,
      subject,
      category,
      description,
      attachments: attachments || [],
      priority: priority || 'Low',
      status: 'Open'
    });

    // Notify Admins
    emitRealTimeUpdate(req, 'admin_tickets', 'ticket_created', ticket);

    // Send confirmation email
    await sendEmail({
      email: req.user.email,
      subject: `[Redsee Support] Ticket Created: #${ticket._id.toString().substring(0, 8)}`,
      message: `Hi ${req.user.name},\n\nYour support ticket has been created successfully.\n\nTicket ID: ${ticket._id}\nSubject: ${subject}\nCategory: ${category}\nDescription: ${description}\n\nOur team is reviewing your query and will respond shortly.\n\nBest regards,\nRedsee Support Team`,
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create ticket', error: error.message });
  }
};

// @desc    Get tickets for logged-in customer
// @route   GET /api/tickets
// @access  Private (Customer)
const getCustomerTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.user._id })
      .sort({ updatedAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tickets', error: error.message });
  }
};

// @desc    Get ticket by ID
// @route   GET /api/tickets/:id
// @access  Private (Customer & Staff)
const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('userId', 'name email avatar')
      .populate('assignedAdmin', 'name email avatar');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const isOwner = ticket.userId._id.toString() === req.user._id.toString();
    const isStaff = ['admin', 'coadmin'].includes(req.user.role);

    if (!isOwner && !isStaff) {
      return res.status(403).json({ message: 'Not authorized to view this ticket' });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch ticket details', error: error.message });
  }
};

// @desc    Add a message to a ticket
// @route   POST /api/tickets/:id/messages
// @access  Private (Customer & Staff)
const addMessageToTicket = async (req, res) => {
  const { messageText, attachments } = req.body;
  const ticketId = req.params.id;

  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const isOwner = ticket.userId.toString() === req.user._id.toString();
    const isStaff = ['admin', 'coadmin'].includes(req.user.role);

    if (!isOwner && !isStaff) {
      return res.status(403).json({ message: 'Not authorized to send messages in this ticket' });
    }

    const senderRole = isStaff ? (req.user.role === 'admin' ? 'admin' : 'coadmin') : 'user';

    const newMessage = {
      senderId: req.user._id,
      senderName: req.user.name,
      senderRole,
      messageText,
      attachments: attachments || [],
      createdAt: new Date()
    };

    ticket.messages.push(newMessage);

    // Auto-update ticket status based on sender
    if (isStaff) {
      ticket.status = 'Pending'; // Pending customer response
      ticket.assignedAdmin = req.user._id; // Auto-assign to admin who replies
    } else {
      ticket.status = 'Open'; // Customer replied, needs admin attention
    }

    await ticket.save();

    // Populate user info for emission
    const updatedTicket = await Ticket.findById(ticketId)
      .populate('userId', 'name email avatar')
      .populate('assignedAdmin', 'name email avatar');

    // Notify active ticket chat room (both user and admin see the message in real time)
    emitRealTimeUpdate(req, `ticket_${ticketId}`, 'new_message', { ticket: updatedTicket, message: newMessage });
    emitRealTimeUpdate(req, 'admin_tickets', 'ticket_updated', updatedTicket);

    // Send notifications
    if (isStaff) {
      // Notify customer via email
      await sendEmail({
        email: updatedTicket.userId.email,
        subject: `[Redsee Support] Update on Ticket #${ticketId.substring(0, 8)}`,
        message: `Hi ${updatedTicket.userId.name},\n\nAn agent has replied to your support ticket:\n\n"${messageText}"\n\nYou can log in and respond directly from your Support Dashboard.\n\nBest regards,\nRedsee Support Team`
      });
    } else {
      // Notify assigned admin or support group via socket
      emitRealTimeUpdate(req, 'admin_notifications', 'customer_message', {
        ticketId,
        subject: ticket.subject,
        messageText,
        senderName: req.user.name
      });
    }

    res.json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: 'Failed to send message', error: error.message });
  }
};

// @desc    Close a ticket
// @route   PUT /api/tickets/:id/close
// @access  Private (Customer & Staff)
const closeTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const isOwner = ticket.userId.toString() === req.user._id.toString();
    const isStaff = ['admin', 'coadmin'].includes(req.user.role);

    if (!isOwner && !isStaff) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    ticket.status = 'Closed';
    await ticket.save();

    const updatedTicket = await Ticket.findById(req.params.id)
      .populate('userId', 'name email avatar')
      .populate('assignedAdmin', 'name email avatar');

    emitRealTimeUpdate(req, `ticket_${ticket._id}`, 'ticket_closed', updatedTicket);
    emitRealTimeUpdate(req, 'admin_tickets', 'ticket_updated', updatedTicket);

    res.json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: 'Failed to close ticket', error: error.message });
  }
};

// @desc    Rate support experience
// @route   PUT /api/tickets/:id/rate
// @access  Private (Customer)
const rateSupportExperience = async (req, res) => {
  const { rating, feedback } = req.body;
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (ticket.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Append rating detail as a special closed message or status detail
    const ratingMessage = {
      senderId: req.user._id,
      senderName: req.user.name,
      senderRole: 'user',
      messageText: `[Customer rated support: ${rating}/5. Feedback: "${feedback || 'None'}"]`,
      createdAt: new Date()
    };

    ticket.messages.push(ratingMessage);
    await ticket.save();

    const updatedTicket = await Ticket.findById(req.params.id)
      .populate('userId', 'name email avatar')
      .populate('assignedAdmin', 'name email avatar');

    emitRealTimeUpdate(req, `ticket_${ticket._id}`, 'ticket_updated', updatedTicket);
    emitRealTimeUpdate(req, 'admin_tickets', 'ticket_updated', updatedTicket);

    res.json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit rating', error: error.message });
  }
};

// @desc    Get all tickets (Admin/Co-admin)
// @route   GET /api/admin/tickets
// @access  Private (Staff only)
const getAllTicketsAdmin = async (req, res) => {
  const { status, priority, search } = req.query;

  try {
    let query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;

    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { orderId: { $regex: search, $options: 'i' } }
      ];
    }

    const tickets = await Ticket.find(query)
      .populate('userId', 'name email avatar')
      .populate('assignedAdmin', 'name email avatar')
      .sort({ updatedAt: -1 });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tickets', error: error.message });
  }
};

// @desc    Update ticket status, priority, or assignee
// @route   PUT /api/admin/tickets/:id
// @access  Private (Staff only)
const updateTicketAdmin = async (req, res) => {
  const { status, priority, assignedAdmin } = req.body;

  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (status) ticket.status = status;
    if (priority) ticket.priority = priority;
    if (assignedAdmin) ticket.assignedAdmin = assignedAdmin;

    await ticket.save();

    const updatedTicket = await Ticket.findById(req.params.id)
      .populate('userId', 'name email avatar')
      .populate('assignedAdmin', 'name email avatar');

    emitRealTimeUpdate(req, `ticket_${ticket._id}`, 'ticket_updated', updatedTicket);
    emitRealTimeUpdate(req, 'admin_tickets', 'ticket_updated', updatedTicket);

    res.json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update ticket', error: error.message });
  }
};

// @desc    Add an internal note
// @route   POST /api/admin/tickets/:id/notes
// @access  Private (Staff only)
const addInternalNote = async (req, res) => {
  const { note } = req.body;

  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    ticket.internalNotes.push({
      note,
      adminName: req.user.name,
      createdAt: new Date()
    });

    await ticket.save();

    const updatedTicket = await Ticket.findById(req.params.id)
      .populate('userId', 'name email avatar')
      .populate('assignedAdmin', 'name email avatar');

    // Notify admins of updated ticket notes
    emitRealTimeUpdate(req, 'admin_tickets', 'ticket_updated', updatedTicket);

    res.json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add internal note', error: error.message });
  }
};

module.exports = {
  createTicket,
  getCustomerTickets,
  getTicketById,
  addMessageToTicket,
  closeTicket,
  rateSupportExperience,
  getAllTicketsAdmin,
  updateTicketAdmin,
  addInternalNote
};

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderName: { type: String, required: true },
  senderRole: { type: String, enum: ['user', 'admin', 'coadmin'], default: 'user' },
  messageText: { type: String },
  attachments: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

const ticketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: String }, // Can be Order ID string or ObjectId reference
  subject: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  attachments: [{ type: String }],
  status: { 
    type: String, 
    enum: ['Open', 'Pending', 'In Progress', 'Resolved', 'Closed'], 
    default: 'Open' 
  },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High'], 
    default: 'Low' 
  },
  assignedAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  internalNotes: [{
    note: String,
    adminName: String,
    createdAt: { type: Date, default: Date.now }
  }],
  messages: [messageSchema]
}, { timestamps: true });

// Index for ticket queries
ticketSchema.index({ userId: 1, status: 1, createdAt: -1 });
ticketSchema.index({ status: 1, priority: -1, createdAt: -1 });

module.exports = mongoose.model('Ticket', ticketSchema);

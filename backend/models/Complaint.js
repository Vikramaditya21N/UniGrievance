const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  complaintId: {
    type: String,
    unique: true,
    index: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    enum: ['infrastructure', 'faculty', 'hostel', 'academic', 'canteen', 'security', 'other'],
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  attachments: [String], // File paths
  location: String,
  status: {
    type: String,
    enum: ['submitted', 'assigned', 'in_progress', 'resolved', 'escalated', 'closed'],
    default: 'submitted',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  assignedToHigherAuthority: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  assignedDate: Date,
  escalatedDate: Date,
  escalationReason: String,
  resolutionDetails: String,
  resolvedDate: Date,
  feedbackRating: {
    type: Number,
    min: 1,
    max: 5,
  },
  feedbackComment: String,
  timeline: {
    assignmentDeadline: Date, // e.g., 5 days from submission
    escalationDeadline: Date, // e.g., 7 days from submission
  },
  activityLog: [{
    action: String,
    performedBy: mongoose.Schema.Types.ObjectId,
    timestamp: { type: Date, default: Date.now },
    details: String,
  }],
});

// Auto-generate complaint ID
complaintSchema.pre('save', async function(next) {
  if (!this.complaintId) {
    const count = await mongoose.model('Complaint').countDocuments();
    const date = new Date();
    this.complaintId = `CMC-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}-${String(count + 1).padStart(5, '0')}`;
  }
  this.updatedAt = Date.now();
  next();
});

// Set timelines on creation
complaintSchema.pre('save', function(next) {
  if (this.isNew) {
    const now = new Date();
    this.timeline = {
      assignmentDeadline: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days
      escalationDeadline: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days
    };
  }
  next();
});

module.exports = mongoose.model('Complaint', complaintSchema);

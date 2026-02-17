const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ['hostel', 'academic', 'general'],
        required: true,
    },
    isAnonymous: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        // Lifecycle: pending -> (in_progress/escalated) -> resolved -> (closed/reopened)
        enum: ['pending', 'in_progress', 'resolved', 'escalated', 'closed', 'reopened'],
        default: 'pending',
    },
    currentLevel: { type: Number, default: 1 }, // Used for escalation logic (1-3)
    // 1: Initial, 2: Middle, 3: Final
    department: String, // Specifically used for routing
    hostel: String,     // Specifically used for routing
    escalationTimer: {
        type: Date,
        default: Date.now,
    },
    actionTaken: String,
    actionDate: Date,
    studentFeedback: String,
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);

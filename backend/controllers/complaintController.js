const Complaint = require('../models/Complaint');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { sendComplaintNotification, sendEscalationNotification } = require('../config/email');

// Create complaint
exports.createComplaint = async (req, res) => {
  try {
    const { category, title, description, location } = req.body;
    const studentId = req.userId;

    // Validate required fields
    if (!category || !title || !description || !location) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Validate category
    const validCategories = ['hostel', 'infrastructure', 'faculty'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid complaint category' });
    }

    // Get student details
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const complaint = new Complaint({
      studentId,
      category,
      title,
      description,
      location,
    });

    await complaint.save();

    // Auto-assign based on category and department
    let assignedAuthority = null;

    switch (category) {
      case 'hostel':
        // Assign to Hostel Warden
        assignedAuthority = await User.findOne({
          authorityType: { $in: ['hostel_warden'] },
          isVerified: true,
        });
        break;

      case 'infrastructure':
      case 'faculty':
      case 'academic':
        // Assign to Department Head of student's department
        assignedAuthority = await User.findOne({
          authorityType: { $in: ['department_head'] },
          department: student.department,
          isVerified: true,
        });
        break;

      case 'canteen':
        // Assign to Canteen Manager
        assignedAuthority = await User.findOne({
          authorityType: { $in: ['canteen_manager'] },
          isVerified: true,
        });
        break;

      case 'security':
        // Assign to Security Chief
        assignedAuthority = await User.findOne({
          authorityType: { $in: ['security_chief'] },
          isVerified: true,
        });
        break;

      case 'other':
        // Assign to Principal
        assignedAuthority = await User.findOne({
          authorityType: { $in: ['principal'] },
          isVerified: true,
        });
        break;
    }

    // If authority found, assign complaint
    if (assignedAuthority) {
      complaint.assignedTo = assignedAuthority._id;
      complaint.status = 'assigned';
      complaint.assignedDate = new Date();

      // Add activity log for auto-assignment
      complaint.activityLog.push({
        action: 'auto_assigned',
        performedBy: null,
        details: `Automatically assigned to ${assignedAuthority.name} (${assignedAuthority.authorityType})`,
      });
    }

    // Add activity log for creation
    complaint.activityLog.push({
      action: 'created',
      performedBy: studentId,
      details: `Complaint submitted by student ${student.name}`,
    });

    await complaint.save();

    res.status(201).json({
      message: 'Complaint submitted successfully',
      complaint,
      assignedTo: assignedAuthority ? assignedAuthority.name : 'Pending assignment',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all complaints (for student - their complaints)
exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ studentId: req.userId })
      .populate('studentId', 'name email rollNumber')
      .populate('assignedTo', 'name email authorityType')
      .sort('-createdAt');

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all complaints (for authorities/admin)
exports.getAllComplaints = async (req, res) => {
  try {
    const { status, category, priority } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    const complaints = await Complaint.find(filter)
      .populate('studentId', 'name email rollNumber department')
      .populate('assignedTo', 'name email authorityType')
      .sort('-createdAt');

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get complaint by ID
exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('studentId', 'name email rollNumber phone department')
      .populate('assignedTo', 'name email authorityType')
      .populate('assignedToHigherAuthority', 'name email authorityType');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Assign complaint to authority
exports.assignComplaint = async (req, res) => {
  try {
    const { complaintId, authorityId, priority } = req.body;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.assignedTo = authorityId;
    complaint.status = 'assigned';
    complaint.assignedDate = new Date();
    complaint.priority = priority || complaint.priority;

    complaint.activityLog.push({
      action: 'assigned',
      performedBy: req.userId,
      details: `Assigned to authority ${authorityId}`,
    });

    await complaint.save();

    // Create notification
    await Notification.create({
      recipientId: authorityId,
      complaintId,
      type: 'assignment',
      title: 'New Complaint Assigned',
      message: `Complaint ${complaint.complaintId} has been assigned to you`,
    });

    // Send email to authority
    const authority = await User.findById(authorityId);
    try {
      await sendComplaintNotification(authority.email, complaint, 'Assigned');
    } catch (emailError) {
      console.log('Email sending failed:', emailError);
    }

    res.json({ message: 'Complaint assigned', complaint });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update complaint status
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status, resolutionDetails } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const previousStatus = complaint.status;
    complaint.status = status;

    if (status === 'resolved') {
      complaint.resolvedDate = new Date();
      complaint.resolutionDetails = resolutionDetails;
    }

    complaint.activityLog.push({
      action: 'status_updated',
      performedBy: req.userId,
      details: `Status changed from ${previousStatus} to ${status}`,
    });

    await complaint.save();

    // Create notification for student
    await Notification.create({
      recipientId: complaint.studentId,
      complaintId: complaint._id,
      type: 'status_update',
      title: 'Complaint Status Updated',
      message: `Your complaint ${complaint.complaintId} status is now ${status}`,
    });

    // Send email to student
    const student = await User.findById(complaint.studentId);
    try {
      await sendComplaintNotification(student.email, complaint, `Status: ${status}`);
    } catch (emailError) {
      console.log('Email sending failed:', emailError);
    }

    res.json({ message: 'Status updated', complaint });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Escalate complaint
exports.escalateComplaint = async (req, res) => {
  try {
    const { escalationReason, higherAuthorityId } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = 'escalated';
    complaint.escalatedDate = new Date();
    complaint.escalationReason = escalationReason;
    complaint.assignedToHigherAuthority = higherAuthorityId;

    complaint.activityLog.push({
      action: 'escalated',
      performedBy: req.userId,
      details: `Escalated to higher authority. Reason: ${escalationReason}`,
    });

    await complaint.save();

    // Create notifications
    await Notification.create({
      recipientId: complaint.studentId,
      complaintId: complaint._id,
      type: 'escalation',
      title: 'Complaint Escalated',
      message: `Your complaint ${complaint.complaintId} has been escalated`,
    });

    await Notification.create({
      recipientId: higherAuthorityId,
      complaintId: complaint._id,
      type: 'assignment',
      title: 'Escalated Complaint',
      message: `Complaint ${complaint.complaintId} has been escalated to you`,
    });

    // Send emails
    const student = await User.findById(complaint.studentId);
    const higherAuthority = await User.findById(higherAuthorityId);

    try {
      await sendEscalationNotification(student.email, complaint);
      await sendEscalationNotification(higherAuthority.email, complaint);
    } catch (emailError) {
      console.log('Email sending failed:', emailError);
    }

    res.json({ message: 'Complaint escalated', complaint });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check and auto-escalate complaints
exports.autoEscalateComplaints = async (req, res) => {
  try {
    const now = new Date();
    const complaints = await Complaint.find({
      status: { $in: ['assigned', 'in_progress'] },
      'timeline.escalationDeadline': { $lt: now },
    });

    for (const complaint of complaints) {
      complaint.status = 'escalated';
      complaint.escalatedDate = now;
      complaint.escalationReason = 'Auto-escalation: Deadline exceeded';

      // Find higher authority (principal if assigned to department head)
      const currentAuthority = await User.findById(complaint.assignedTo);
      let higherAuthority;

      if (currentAuthority?.authorityType === 'department_head') {
        higherAuthority = await User.findOne({ authorityType: 'principal' });
      } else if (currentAuthority?.authorityType === 'principal') {
        higherAuthority = await User.findOne({ authorityType: 'director' });
      }

      if (higherAuthority) {
        complaint.assignedToHigherAuthority = higherAuthority._id;

        complaint.activityLog.push({
          action: 'auto_escalated',
          performedBy: null,
          details: 'Auto-escalated due to deadline',
        });

        await complaint.save();

        // Create notifications
        await Notification.create({
          recipientId: complaint.studentId,
          complaintId: complaint._id,
          type: 'escalation',
          title: 'Complaint Auto-Escalated',
          message: `Your complaint ${complaint.complaintId} has been auto-escalated`,
        });

        await Notification.create({
          recipientId: higherAuthority._id,
          complaintId: complaint._id,
          type: 'assignment',
          title: 'Escalated Complaint',
          message: `Complaint ${complaint.complaintId} has been escalated to you`,
        });
      }
    }

    res.json({ message: `${complaints.length} complaints auto-escalated` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get complaint statistics
exports.getStatistics = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const submitted = await Complaint.countDocuments({ status: 'submitted' });
    const assigned = await Complaint.countDocuments({ status: 'assigned' });
    const inProgress = await Complaint.countDocuments({ status: 'in_progress' });
    const resolved = await Complaint.countDocuments({ status: 'resolved' });
    const escalated = await Complaint.countDocuments({ status: 'escalated' });

    const byCategory = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    res.json({
      total,
      submitted,
      assigned,
      inProgress,
      resolved,
      escalated,
      byCategory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

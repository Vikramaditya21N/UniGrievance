const User = require('../models/User');

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, department } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, phone, department },
      { new: true, runValidators: true }
    );
    res.json({ message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all authorities (for admin)
exports.getAllAuthorities = async (req, res) => {
  try {
    const authorities = await User.find({
      role: { $in: ['authority', 'higher_authority'] },
    });
    res.json(authorities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get notifications
exports.getNotifications = async (req, res) => {
  try {
    const Notification = require('../models/Notification');
    const notifications = await Notification.find({ recipientId: req.userId })
      .sort('-createdAt')
      .limit(50);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark notification as read
exports.markNotificationAsRead = async (req, res) => {
  try {
    const Notification = require('../models/Notification');
    await Notification.findByIdAndUpdate(req.params.notificationId, {
      isRead: true,
    });
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get all faculty members (only for principal/director/admin)
exports.getAllFaculty = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    // Check if user is principal, director, or admin
    if (!user || !['higher_authority', 'admin'].includes(user.role)) {
      return res.status(403).json({ message: 'Unauthorized. Only principals/directors can manage faculty.' });
    }

    const faculty = await User.find({
      role: 'authority',
    }).select('-password');
    
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update faculty roles (only for principal/director/admin)
exports.updateFacultyRoles = async (req, res) => {
  try {
    const { userId } = req.params;
    const { authorityType } = req.body;
    const currentUser = await User.findById(req.userId);

    // Check if current user is principal, director, or admin
    if (!currentUser || !['higher_authority', 'admin'].includes(currentUser.role)) {
      return res.status(403).json({ message: 'Unauthorized. Only principals/directors can update faculty roles.' });
    }

    // Validate that target user is faculty
    const targetUser = await User.findById(userId);
    if (!targetUser || targetUser.role !== 'authority') {
      return res.status(404).json({ message: 'Faculty member not found' });
    }

    // Validate authorityType is an array
    if (!Array.isArray(authorityType)) {
      return res.status(400).json({ message: 'authorityType must be an array' });
    }

    // Update faculty roles
    targetUser.authorityType = authorityType;
    await targetUser.save();

    res.json({ message: 'Faculty roles updated successfully', user: targetUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
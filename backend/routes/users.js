const express = require('express');
const {
  getUserProfile,
  updateProfile,
  getAllAuthorities,
  getNotifications,
  markNotificationAsRead,
  getAllFaculty,
  updateFacultyRoles,
} = require('../controllers/userController');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

router.get('/profile', auth, getUserProfile);
router.put('/profile', auth, updateProfile);
router.get('/authorities', auth, authorize('admin'), getAllAuthorities);
router.get('/notifications', auth, getNotifications);
router.patch('/notifications/:notificationId/read', auth, markNotificationAsRead);
router.get('/faculty', auth, getAllFaculty);
router.put('/:userId/roles', auth, updateFacultyRoles);

module.exports = router;

const express = require('express');
const router = express.Router();
const { createComplaint, getComplaints, takeAction } = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('student'), createComplaint)
    .get(protect, getComplaints);

router.put('/:id/action', protect, authorize('warden', 'chief_warden', 'hod', 'principal', 'student'), takeAction);

module.exports = router;

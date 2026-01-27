const express = require('express');
const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getComplaintById,
  assignComplaint,
  updateComplaintStatus,
  escalateComplaint,
  autoEscalateComplaints,
  getStatistics,
} = require('../controllers/complaintController');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

// Student routes
router.post('/', auth, authorize('student'), createComplaint);
router.get('/my-complaints', auth, authorize('student'), getMyComplaints);
router.get('/details/:id', auth, getComplaintById);

// Authority/Admin routes - Specific routes first
router.post('/assign', auth, authorize('authority', 'admin'), assignComplaint);
router.patch('/:id/status', auth, authorize('authority', 'higher_authority', 'admin'), updateComplaintStatus);
router.patch('/:id/escalate', auth, authorize('authority', 'admin'), escalateComplaint);

// Generic routes
router.get('/', auth, authorize('authority', 'higher_authority', 'admin'), getAllComplaints);

// Auto-escalation (cron job)
router.post('/auto-escalate', autoEscalateComplaints);

// Statistics
router.get('/statistics', auth, authorize('admin'), getStatistics);

module.exports = router;

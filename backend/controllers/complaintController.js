const Complaint = require('../models/Complaint');
const User = require('../models/User');

/**
 * @desc    Create new grievance
 * @route   POST /api/complaints
 * @access  Private (Student)
 * 
 * This function handles the logic for routing a new grievance to the correct authority
 * based on the category (hostel, academic, or general).
 */
exports.createComplaint = async (req, res) => {
    try {
        const { title, description, category, isAnonymous, department, hostel } = req.body;

        let assignedToId;

        // --- Routing Logic ---

        // 1. Hostel Issues: Routed to the specific Hostel Warden
        if (category === 'hostel') {
            const warden = await User.findOne({ role: 'warden', hostel });
            console.log(`Routing Hostel Complaint for: ${hostel}, Warden found: ${warden ? warden.name : 'None'}`);
            if (!warden) {
                // Fail-safe: If no warden exists for that hostel, route to Principal
                const principal = await User.findOne({ role: 'principal' });
                assignedToId = principal._id;
            } else {
                assignedToId = warden._id;
            }

            // 2. Academic Issues: Routed to the Department HOD
        } else if (category === 'academic') {
            const hod = await User.findOne({ role: 'hod', department });
            console.log(`Routing Academic Complaint for: ${department}, HOD found: ${hod ? hod.name : 'None'}`);
            if (!hod) {
                // Fail-safe: If no HOD exists for that dept, route to Principal
                const principal = await User.findOne({ role: 'principal' });
                assignedToId = principal._id;
            } else {
                assignedToId = hod._id;
            }

            // 3. General Issues: Routed directly to the Principal
        } else {
            console.log(`Routing General Complaint to Principal`);
            const principal = await User.findOne({ role: 'principal' });
            assignedToId = principal._id;
        }

        // Save the grievance to the database
        const complaint = await Complaint.create({
            title,
            description,
            category,
            isAnonymous,
            department,
            hostel,
            createdBy: req.user.id,
            assignedTo: assignedToId,
            currentLevel: 1 // Starts at level 1 (Warden/HOD)
        });

        res.status(201).json({ success: true, data: complaint });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Get grievances for the logged-in user (role-based)
 * @route   GET /api/complaints
 * @access  Private
 * 
 * Students see their own grievances.
 * Authorities see only grievances assigned to them.
 */
exports.getComplaints = async (req, res) => {
    try {
        const { status } = req.query;
        // Default filter: show everything except strictly 'closed' ones (unless requested)
        let filter = status ? { status } : { status: { $ne: 'closed' } };
        let query;

        if (req.user.role === 'student') {
            // Students only see their own filed issues
            query = Complaint.find({ createdBy: req.user.id, ...filter });
        } else {
            // Authorities see active issues assigned to their ID
            query = Complaint.find({ assignedTo: req.user.id, ...filter });
        }

        const complaints = await query.populate('createdBy', 'name rollNumber').sort('-createdAt');

        // --- Identity Protection (Anonymity) ---
        // If a student marked the grievance as anonymous, the authority sees "Anonymous Student"
        const maskedComplaints = complaints.map(c => {
            const obj = c.toObject();
            if (obj.isAnonymous && req.user.role !== 'student') {
                obj.createdBy = { name: 'Anonymous Student', rollNumber: 'HIDDEN' };
            }
            return obj;
        });

        res.json({ success: true, data: maskedComplaints });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Process a grievance (Update status, add resolution)
 * @route   PUT /api/complaints/:id/action
 * @access  Private (Authority or Student for closing)
 */
exports.takeAction = async (req, res) => {
    try {
        const { status, actionTaken, studentFeedback } = req.body;
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Grievance not found' });
        }

        // --- Student Feedback Logic ---
        // Students can only "Close" or "Reopen" a grievance AFTER the authority Marks as Resolved.
        if (req.user.role === 'student') {
            if (complaint.createdBy.toString() !== req.user.id) {
                return res.status(403).json({ message: 'Not authorized' });
            }
            if (!['closed', 'reopened'].includes(status)) {
                return res.status(400).json({ message: 'You can only confirm resolution or reopen the issue' });
            }
        }

        // Update fields if provided
        if (status) complaint.status = status;
        if (actionTaken) {
            complaint.actionTaken = actionTaken;
            complaint.actionDate = Date.now();
        }
        if (studentFeedback) {
            complaint.studentFeedback = studentFeedback;
        }

        await complaint.save();

        res.json({ success: true, data: complaint });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

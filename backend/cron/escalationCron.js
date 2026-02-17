const cron = require('node-cron');
const Complaint = require('../models/Complaint');
const User = require('../models/User');

/**
 * --- Escalation Engine ---
 * This function automatically promotes unattended grievances to the next authority level.
 * It is called every midnight via the cron job below.
 */
const escalateComplaints = async () => {
    // 3 days ago is the threshold for escalation
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

    // Find grievances that are still 'pending' and older than 3 days
    const complaints = await Complaint.find({
        status: 'pending',
        createdAt: { $lt: threeDaysAgo }
    });

    for (let complaint of complaints) {
        let nextAuthority;

        // --- Category Based Escalation Path ---

        // 1. Hostel Escalation Path: Warden (1) -> Chief Warden (2) -> Principal (3)
        if (complaint.category === 'hostel') {
            if (complaint.currentLevel === 1) {
                // Currently with Warden, promote to Chief Warden
                nextAuthority = await User.findOne({ role: 'chief_warden' });
                complaint.currentLevel = 2;
            } else if (complaint.currentLevel === 2) {
                // Currently with Chief Warden, promote to Principal
                nextAuthority = await User.findOne({ role: 'principal' });
                complaint.currentLevel = 3;
            }

            // 2. Academic Escalation Path: HOD (1) -> Principal (2)
        } else if (complaint.category === 'academic') {
            if (complaint.currentLevel === 1) {
                // Currently with HOD, promote to Principal
                nextAuthority = await User.findOne({ role: 'principal' });
                complaint.currentLevel = 2;
            }
        }

        // If a next authority was found, update the grievance
        if (nextAuthority) {
            complaint.assignedTo = nextAuthority._id;
            complaint.status = 'escalated'; // Mark as escalated for visual visibility
            complaint.escalationTimer = Date.now(); // Reset timer for the next level
            await complaint.save();
            console.log(`AUTO-ESCALATION: Moved ${complaint._id} to ${nextAuthority.role}`);
        }
    }
};

/**
 * Configure the Cron Job
 * '0 0 * * *' = Runs exactly at 00:00 (Midnight) every day.
 */
cron.schedule('0 0 * * *', () => {
    console.log('--- Running Nightly Escalation Cron Job ---');
    escalateComplaints();
});

module.exports = escalateComplaints;

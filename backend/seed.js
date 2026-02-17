const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const officials = [
    { name: 'Dr. Principal', email: 'principal@mitmuzaffarpur.edu', password: 'password123', role: 'principal' },
    { name: 'Chief Warden', email: 'chief.warden@mitmuzaffarpur.edu', password: 'password123', role: 'chief_warden' },

    // HODs
    { name: 'HOD CSE', email: 'hod.cse@mitmuzaffarpur.edu', password: 'password123', role: 'hod', department: 'CSE' },
    { name: 'HOD IT', email: 'hod.it@mitmuzaffarpur.edu', password: 'password123', role: 'hod', department: 'IT' },
    { name: 'HOD MECHANICAL', email: 'hod.mech@mitmuzaffarpur.edu', password: 'password123', role: 'hod', department: 'MECHANICAL' },
    { name: 'HOD CIVIL', email: 'hod.civil@mitmuzaffarpur.edu', password: 'password123', role: 'hod', department: 'CIVIL' },
    { name: 'HOD BMR', email: 'hod.bmr@mitmuzaffarpur.edu', password: 'password123', role: 'hod', department: 'BMR' },
    { name: 'HOD ECE', email: 'hod.ece@mitmuzaffarpur.edu', password: 'password123', role: 'hod', department: 'ECE' },
    { name: 'HOD EE', email: 'hod.ee@mitmuzaffarpur.edu', password: 'password123', role: 'hod', department: 'EE' },
    { name: 'HOD CHEMICAL', email: 'hod.chemical@mitmuzaffarpur.edu', password: 'password123', role: 'hod', department: 'CHEMICAL' },

    // Wardens
    { name: 'Warden H1', email: 'warden.h1@mitmuzaffarpur.edu', password: 'password123', role: 'warden', hostel: 'H1' },
    { name: 'Warden H2', email: 'warden.h2@mitmuzaffarpur.edu', password: 'password123', role: 'warden', hostel: 'H2' },
    { name: 'Warden H3', email: 'warden.h3@mitmuzaffarpur.edu', password: 'password123', role: 'warden', hostel: 'H3' },
    { name: 'Warden H4', email: 'warden.h4@mitmuzaffarpur.edu', password: 'password123', role: 'warden', hostel: 'H4' },
    { name: 'Warden H5', email: 'warden.h5@mitmuzaffarpur.edu', password: 'password123', role: 'warden', hostel: 'H5' },
    { name: 'Warden H6', email: 'warden.h6@mitmuzaffarpur.edu', password: 'password123', role: 'warden', hostel: 'H6' },
    { name: 'Warden H7', email: 'warden.h7@mitmuzaffarpur.edu', password: 'password123', role: 'warden', hostel: 'H7' },
    { name: 'Warden GIRLS', email: 'warden.girls@mitmuzaffarpur.edu', password: 'password123', role: 'warden', hostel: 'GIRLS_HOSTEL' },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected for seeding...');

        // Clear existing officials
        await User.deleteMany({ role: { $ne: 'student' } });

        // Add new officials
        for (const official of officials) {
            await User.create(official);
        }
        console.log('Officials seeded successfully!');

        mongoose.connection.close();
    } catch (error) {
        console.error('Seeding error:', error);
    }
};

seedDB();

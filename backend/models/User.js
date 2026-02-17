const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    rollNumber: {
        type: String,
        unique: true,
        sparse: true, // Optional for non-students
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    role: {
        type: String,
        // The hierarchy: student -> warden/hod -> chief_warden -> principal -> admin
        enum: ['student', 'warden', 'chief_warden', 'hod', 'principal', 'admin'],
        default: 'student',
    },
    department: {
        type: String,
        enum: ['IT', 'CSE', 'MECHANICAL', 'CIVIL', 'BMR', 'ECE', 'EE', 'CHEMICAL', null],
        default: null,
    },
    hostel: {
        type: String,
        enum: ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'GIRLS_HOSTEL', null],
        default: null,
    },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

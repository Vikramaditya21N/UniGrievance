const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected');

    // Clear existing admin/faculty users (optional)
    // await User.deleteMany({ role: { $in: ['admin', 'authority', 'higher_authority'] } });

    // Create Admin User
    const adminExists = await User.findOne({ email: 'admin@college.com' });
    if (!adminExists) {
      const admin = new User({
        name: 'Admin User',
        email: 'admin@college.com',
        rollNumber: 'ADMIN001',
        password: 'admin123',
        phone: '9876543210',
        department: 'Administration',
        isVerified: true,
        role: 'admin',
      });
      await admin.save();
      console.log('✅ Admin created: admin@college.com / admin123');
    }

    // Create Department Head (Faculty)
    const deptHeadExists = await User.findOne({ email: 'depthead@college.com' });
    if (!deptHeadExists) {
      const deptHead = new User({
        name: 'Dr. Rajesh Kumar',
        email: 'depthead@college.com',
        rollNumber: 'DEPT001',
        password: 'dept123',
        phone: '9876543211',
        department: 'CSE',
        isVerified: true,
        role: 'authority',
        authorityType: ['department_head'],
      });
      await deptHead.save();
      console.log('✅ Department Head created: depthead@college.com / dept123');
    }

    // Create Principal (Higher Authority)
    const principalExists = await User.findOne({ email: 'principal@college.com' });
    if (!principalExists) {
      const principal = new User({
        name: 'Dr. Priya Singh',
        email: 'principal@college.com',
        rollNumber: 'PRINCIPAL001',
        password: 'principal123',
        phone: '9876543212',
        department: 'Administration',
        isVerified: true,
        role: 'higher_authority',
        authorityType: ['principal'],
      });
      await principal.save();
      console.log('✅ Principal created: principal@college.com / principal123');
    }

    // Create Director (Highest Authority)
    const directorExists = await User.findOne({ email: 'director@college.com' });
    if (!directorExists) {
      const director = new User({
        name: 'Dr. Vikram Patel',
        email: 'director@college.com',
        rollNumber: 'DIRECTOR001',
        password: 'director123',
        phone: '9876543213',
        department: 'Administration',
        isVerified: true,
        role: 'higher_authority',
        authorityType: ['director'],
      });
      await director.save();
      console.log('✅ Director created: director@college.com / director123');
    }

    // Create Test Student
    const studentExists = await User.findOne({ email: 'student@college.com' });
    if (!studentExists) {
      const student = new User({
        name: 'Akash Singh',
        email: 'student@college.com',
        rollNumber: 'CSE2022001',
        password: 'student123',
        phone: '9876543214',
        department: 'CSE',
        isVerified: true,
        role: 'student',
      });
      await student.save();
      console.log('✅ Student created: student@college.com / student123');
    }

    console.log('\n✅ All test accounts created successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('────────────────────────────────────────');
    console.log('Student:          student@college.com / student123');
    console.log('Department Head:  depthead@college.com / dept123');
    console.log('Principal:        principal@college.com / principal123');
    console.log('Director:         director@college.com / director123');
    console.log('Admin:            admin@college.com / admin123');
    console.log('────────────────────────────────────────\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

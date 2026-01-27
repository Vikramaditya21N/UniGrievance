# 🎓 UniGrievance - Grievance Management System

A complete solution for managing student and faculty complaints in universities.

## ✨ Key Features

- 🔐 **Secure Authentication** - Student registration, email verification, JWT login
- 📝 **Easy Complaint Filing** - Multiple categories (Hostel, Infrastructure, Faculty, etc.)
- 📊 **Real-time Tracking** - Monitor complaint status from submission to resolution
- 👥 **Authority Management** - Department Heads, Principals, Directors, Admin roles
- ⏰ **Auto-Escalation** - Complaints escalate automatically if not resolved in time
- 📧 **Instant Notifications** - Email & in-app updates on status changes
- 📈 **Admin Analytics** - Dashboard with grievance statistics and insights
- 🎨 **Modern UI** - Responsive design, professional college theme

## 📁 Project Structure

```
UniGrievance/
│
├── 🔙 backend/              (Node.js + Express + MongoDB)
│   ├── config/              (Email configuration)
│   ├── controllers/         (Business logic)
│   ├── middleware/          (Authentication)
│   ├── models/              (Database schemas)
│   ├── routes/              (API endpoints)
│   ├── server.js            (Main server)
│   ├── seed.js              (Sample data)
│   └── package.json
│
└── 🎨 frontend/             (React)
    ├── public/              (HTML template)
    ├── src/
    │   ├── pages/           (Login, Register, Dashboard, etc.)
    │   ├── components/      (Navbar, Footer, etc.)
    │   ├── context/         (Authentication state)
    │   ├── services/        (API calls)
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## Setup Instructions

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
   - MongoDB connection string
   🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- Gmail account (for email notifications)

### Backend Setup (Terminal 1)

```bash
cd backend
npm install
```

Create `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/unigrievance
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000
```

Start server:
```bash
npm start
```

### Frontend Setup (Terminal 2)

```🔗 Main API Endpoints

### Authentication
```
POST   /api/auth/register              Register new account
POST   /api/auth/login                 Login
GET    /api/auth/verify-email/:token   Verify email
POST   /api/auth/resend-verification   Resend verification email
```

### Complaints
```
POST   /api/complaints                 File new complaint
GET    /api/complaints/my-complaints   Get your complaints
GET    /api/complaints                 Get all (authority/admin)
PATCH  /api/complaints/:id/status      Update status
PATCH  /api/complaints/:id/escalate    Escalate complaint
GET    /api/complaints/statistics      Get analytics (admin)
```

### User
```
GET    /api/users/profile              Get profile
PUT    /api/users/profile              Update profile
GET    /api/users/notifications        Get notifications
```
2. **Department Head (Authority)**: Can view assigned complaints, update status
3. 👥 User Roles

| Role | Access | Permissions |
|------|--------|-------------|
| **Student** | File & track complaints | View own complaints, submit feedback |
| **Department Head** | View assigned complaints | Update status, assign to self |
| **Principal** | Escalated complaints | Review, reassign, resolve |
| **Director** | All complaints | Final approval, system overview |
| **Admin** | Full system access | Manage users, view statistics |

## 📊 Complaint Workflow

```
┌─────────┐     ┌──────────┐     ┌─────────────┐     ┌──────────┐
│Submitted│ --> │Assigned  │ --> │In Progress  │ --> │Resolved  │
└──💾 Database Schema

### User
```
name, email, rollNumber, password, phone, department
role: student | authority | higher_authority | admin
authorityType: [department_head, principal, director, ...]
```

### Complaint
```
complaintId (auto-generated: CMC-202401-00001)
studentId, category, title, description, location
status: submitted | assigned | in_progress | escalated | resolved
priority: low | medium | high | urgent
assignedTo, timeline, activityLog, resolutionDetails
```

### Notification
```
recipientId, complaintId, type, message, isRead
```
- complaintId (auto-generated)
- studentId, category, title, description, location
- status, priority, assignedTo, assignedToHigherAuthority
- timeline (assignmentDeadline, escalationDeadline)
- activityLog (all actions with timestamp)
- resolutionDetails, feedbackRating

### Notification Schema
- recipientId, complaintId, type, title, message
- isRead flag, timestamp

## Testing

### Test Student Registration
1. Register with student credentials
2. Check email for verification link
3. Verify email and login

### Test Complaint Filing
1. Login as student
2. Click "File New Complaint"
3. Fill form and submit
4. View in dashboard

### Test Authority Flow
1. 🧪 Test Accounts

Use these after running `seed.js`:

| Role | Email | Password |
|------|-------|----------|
| Student | student@college.com | student123 |
| Dept Head | depthead@college.com | dept123 |
| Principal | principal@college.com | principal123 |
| Director | director@college.com | director123 |
| Admin | admin@college.com | admin123 |

## 📧 Email Setup (Gmail)

1. Enable 2-Factor Authentication
2. Go to: myaccount.google.com/apppasswords
3. Generate 16-character password
4. Add to `.env` as `EMAIL_PASS`

## 🔒 Security Features

✅ JWT Authentication
✅ Password Hashing (bcryptjs)
✅ CORS Protection
✅ Role-Based Access Control (RBAC)
✅ Input Validation
✅ Email Verification

## 📱 Tech Stack

**Backend:** Node.js, Express, MongoDB, Mongoose
**Frontend:** React, React Router, Bootstrap
**Authentication:** JWT
**Email:** Nodemailer

## 🚢 Deployment Tips

- Use MongoDB Atlas for database
- Deploy backend on Heroku/Railway
- Deploy frontend on Vercel/Netlify
- Store secrets in environment variables
- Enable HTTPS in production

## 📝 License

MIT License - Feel free to use this project!

## ❓ Need Help?

Check the issues in GitHub or
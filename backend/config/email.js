const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (email, verificationToken) => {
  const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verification - UniGrievance Grievance Management System',
    html: `
      <h2>Welcome to UniGrievance</h2>
      <p>Please verify your email to proceed with registering on UniGrievance:</p>
      <a href="${verificationLink}" style="background-color: #003d7a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Verify Email
      </a>
      <p>Or copy this link: ${verificationLink}</p>
      <p>This link expires in 24 hours.</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};

const sendComplaintNotification = async (email, complaint, action) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Complaint ${action} - ${complaint.complaintId}`,
    html: `
      <h2>Complaint Status Update</h2>
      <p><strong>Complaint ID:</strong> ${complaint.complaintId}</p>
      <p><strong>Title:</strong> ${complaint.title}</p>
      <p><strong>Status:</strong> ${complaint.status}</p>
      <p><strong>Action:</strong> ${action}</p>
      <p>Please log in to view more details.</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};

const sendEscalationNotification = async (email, complaint) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Complaint Escalated - ${complaint.complaintId}`,
    html: `
      <h2>Complaint Escalation Notice</h2>
      <p>The following complaint has been escalated to higher authority:</p>
      <p><strong>Complaint ID:</strong> ${complaint.complaintId}</p>
      <p><strong>Title:</strong> ${complaint.title}</p>
      <p><strong>Reason:</strong> ${complaint.escalationReason}</p>
      <p>Please log in to view more details.</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendVerificationEmail,
  sendComplaintNotification,
  sendEscalationNotification,
};

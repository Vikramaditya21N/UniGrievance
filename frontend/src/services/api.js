import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const authService = {
  register: (data) => axios.post(`${API_BASE_URL}/auth/register`, data),
  login: (data) => axios.post(`${API_BASE_URL}/auth/login`, data),
  verifyEmail: (token) => axios.get(`${API_BASE_URL}/auth/verify-email/${token}`),
  resendVerificationEmail: (email) => axios.post(`${API_BASE_URL}/auth/resend-verification`, { email }),
};

export const complaintService = {
  createComplaint: (data, token) => 
    axios.post(`${API_BASE_URL}/complaints`, data, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  getMyComplaints: (token) => 
    axios.get(`${API_BASE_URL}/complaints/my-complaints`, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  getAllComplaints: (token, filters = {}) => 
    axios.get(`${API_BASE_URL}/complaints`, {
      params: filters,
      headers: { Authorization: `Bearer ${token}` }
    }),
  getComplaintById: (id, token) => 
    axios.get(`${API_BASE_URL}/complaints/details/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  assignComplaint: (data, token) => 
    axios.post(`${API_BASE_URL}/complaints/assign`, data, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  updateComplaintStatus: (id, data, token) => 
    axios.patch(`${API_BASE_URL}/complaints/${id}/status`, data, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  escalateComplaint: (id, data, token) => 
    axios.patch(`${API_BASE_URL}/complaints/${id}/escalate`, data, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  getStatistics: (token) => 
    axios.get(`${API_BASE_URL}/complaints/statistics`, {
      headers: { Authorization: `Bearer ${token}` }
    }),
};

export const userService = {
  getUserProfile: (token) => 
    axios.get(`${API_BASE_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  updateProfile: (data, token) => 
    axios.put(`${API_BASE_URL}/users/profile`, data, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  getNotifications: (token) => 
    axios.get(`${API_BASE_URL}/users/notifications`, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  markNotificationAsRead: (notificationId, token) => 
    axios.patch(`${API_BASE_URL}/users/notifications/${notificationId}/read`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  getAllFaculty: (token) => 
    axios.get(`${API_BASE_URL}/users/faculty`, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  updateFacultyRoles: (userId, authorityType, token) => 
    axios.put(`${API_BASE_URL}/users/${userId}/roles`, { authorityType }, {
      headers: { Authorization: `Bearer ${token}` }
    }),
};

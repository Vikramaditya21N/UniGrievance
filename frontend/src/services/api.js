import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Request interceptor for adding JWT
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    changePassword: (data) => api.put('/auth/change-password', data),
};

export const complaintService = {
    create: (data) => api.post('/complaints', data),
    getAll: (status) => api.get('/complaints', { params: { status } }),
    takeAction: (id, data) => api.put(`/complaints/${id}/action`, data),
};

export default api;

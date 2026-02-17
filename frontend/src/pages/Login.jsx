import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

/**
 * --- Login Page ---
 * Secure entry point for Students and Authorities.
 * Connects with the AuthContext to manage session state.
 */
const Login = () => {
    // --- State & Context ---
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth(); // Global login method
    const navigate = useNavigate();

    /**
     * Submit login credentials to the backend
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await authService.login(formData);
            // Save user info and JWT token globally
            login(data.user, data.token);
            toast.success('Welcome back!');
            navigate('/dashboard'); // Direct to role-based dashboard
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '30px' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h2 style={{ marginBottom: '10px' }}>Welcome Back</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Please enter your credentials to continue</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="College Email"
                        className="input-field"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="input-field"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                    <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '20px' }}>
                    Student? <Link to="/register" style={{ color: 'white', fontWeight: '500' }}>Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;

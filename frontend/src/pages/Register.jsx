import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

/**
 * --- Student Registration Page ---
 * New students sign up here. 
 * Requires specific details (Roll Number, Department, Hostel) for automated grievance routing.
 */
const Register = () => {
    // --- State & Navigation ---
    const [formData, setFormData] = useState({
        name: '',
        rollNumber: '',
        email: '',
        password: '',
        department: '',
        hostel: ''
    });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    /**
     * Submit registration data to the backend
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await authService.register(formData);
            login(data.user, data.token); // Automatically log in after registration
            toast.success('Registration successful!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh' }}>
            {/* Note: Registration uses a high-contrast white card for maximum readability 
                during the data-entry process.
            */}
            <div className="glass-card" style={{
                width: '100%',
                maxWidth: '550px',
                padding: 'clamp(20px, 5vw, 40px)',
                background: '#ffffff',
                backdropFilter: 'none',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h2 style={{ marginBottom: '10px', background: 'none', WebkitTextFillColor: '#1e293b', color: '#1e293b' }}>Student Registration</h2>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Join the UniGrievance community for a better campus experience</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Full Name"
                        className="input-field"
                        style={{ color: '#1e293b', background: '#f8fafc', borderColor: '#e2e8f0' }}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Roll Number"
                        className="input-field"
                        style={{ color: '#1e293b', background: '#f8fafc', borderColor: '#e2e8f0' }}
                        value={formData.rollNumber}
                        onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email Address"
                        className="input-field"
                        style={{ color: '#1e293b', background: '#f8fafc', borderColor: '#e2e8f0' }}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password (min 6 chars)"
                        className="input-field"
                        style={{ color: '#1e293b', background: '#f8fafc', borderColor: '#e2e8f0' }}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        minLength="6"
                    />

                    {/* Department Dropdown: Essential for Academic Routing */}
                    <select
                        className="input-field"
                        style={{ color: '#1e293b', background: '#f8fafc', borderColor: '#e2e8f0' }}
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        required
                    >
                        <option value="" style={{ color: '#1e293b' }}>Select Department</option>
                        <option value="IT" style={{ color: '#1e293b' }}>IT</option>
                        <option value="CSE" style={{ color: '#1e293b' }}>CSE</option>
                        <option value="MECHANICAL" style={{ color: '#1e293b' }}>MECHANICAL</option>
                        <option value="CIVIL" style={{ color: '#1e293b' }}>CIVIL</option>
                        <option value="BMR" style={{ color: '#1e293b' }}>BMR</option>
                        <option value="ECE" style={{ color: '#1e293b' }}>ECE</option>
                        <option value="EE" style={{ color: '#1e293b' }}>EE</option>
                        <option value="CHEMICAL" style={{ color: '#1e293b' }}>CHEMICAL</option>
                    </select>

                    {/* Hostel Dropdown: Essential for Hostel Routing */}
                    <select
                        className="input-field"
                        style={{ color: '#1e293b', background: '#f8fafc', borderColor: '#e2e8f0' }}
                        value={formData.hostel}
                        onChange={(e) => setFormData({ ...formData, hostel: e.target.value })}
                        required
                    >
                        <option value="" style={{ color: '#1e293b' }}>Select Hostel</option>
                        <option value="H1" style={{ color: '#1e293b' }}>H1</option>
                        <option value="H2" style={{ color: '#1e293b' }}>H2</option>
                        <option value="H3" style={{ color: '#1e293b' }}>H3</option>
                        <option value="H4" style={{ color: '#1e293b' }}>H4</option>
                        <option value="H5" style={{ color: '#1e293b' }}>H5</option>
                        <option value="H6" style={{ color: '#1e293b' }}>H6</option>
                        <option value="H7" style={{ color: '#1e293b' }}>H7</option>
                        <option value="GIRLS_HOSTEL" style={{ color: '#1e293b' }}>Girls Hostel</option>
                    </select>

                    <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Creating account...' : 'Register'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '20px', color: '#64748b' }}>
                    Already registered? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;

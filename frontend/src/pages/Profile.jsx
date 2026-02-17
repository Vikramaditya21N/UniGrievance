import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { toast } from 'react-toastify';

/**
 * --- Profile Page ---
 * Allows users (primarily students) to view their college information
 * and change their account password.
 */
const Profile = () => {
    // --- State & Context ---
    const { user } = useAuth(); // Current logged-in user data
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
    const [loading, setLoading] = useState(false);

    /**
     * Handle password update request
     */
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.changePassword(passwords);
            toast.success('Password updated successfully!');
            // Reset form on success
            setPasswords({ currentPassword: '', newPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 'clamp(15px, 5vw, 40px)', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)' }}>👤 My Profile</h1>

            {/* --- College Details Card ---
                Displays read-only information fetched from the AuthContext.
            */}
            <div className="glass-card" style={{ padding: 'clamp(20px, 4vw, 30px)', marginTop: '30px' }}>
                <h3>College Details</h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: window.innerWidth < 600 ? '1fr' : '1fr 1fr',
                    gap: '20px',
                    marginTop: '20px'
                }}>
                    <div>
                        <label style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>FULL NAME</label>
                        <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{user.name}</p>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>ROLL NUMBER</label>
                        <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{user.rollNumber || 'N/A'}</p>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>DEPARTMENT</label>
                        <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{user.department}</p>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>HOSTEL</label>
                        <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{user.hostel}</p>
                    </div>
                    <div style={{ gridColumn: window.innerWidth < 600 ? 'span 1' : 'span 2' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>COLLEGE EMAIL</label>
                        <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{user.email}</p>
                    </div>
                </div>
            </div>

            {/* --- Security Card ---
                Form to update the user's password.
            */}
            <div className="glass-card" style={{ padding: 'clamp(20px, 4vw, 30px)', marginTop: '30px' }}>
                <h3>Change Password</h3>
                <form onSubmit={handlePasswordChange} style={{ marginTop: '20px' }}>
                    <input
                        type="password"
                        placeholder="Current Password"
                        className="input-field"
                        value={passwords.currentPassword}
                        onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                        required
                    />
                    <input
                        type="password"
                        placeholder="New Password"
                        className="input-field"
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                        required
                        minLength="6"
                    />
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;

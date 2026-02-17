import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar" style={{
            flexWrap: 'wrap',
            justifyContent: window.innerWidth < 480 ? 'center' : 'space-between',
            gap: '10px'
        }}>
            <Link to="/" style={{
                fontSize: 'clamp(1.2rem, 4vw, 1.6rem)',
                fontWeight: '800',
                textDecoration: 'none',
                background: 'linear-gradient(135deg, #fff 0%, var(--primary) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                <span style={{ fontSize: '1.8rem', WebkitTextFillColor: 'initial' }}>🎓</span> UniGrievance
            </Link>
            <div style={{
                display: 'flex',
                gap: '15px',
                alignItems: 'center',
                flexWrap: 'wrap',
                justifyContent: 'center'
            }}>
                {!user ? (
                    <>
                        <Link to="/login" style={{ color: 'var(--secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Login</Link>
                        <Link to="/register" className="btn-primary" style={{ textDecoration: 'none', padding: '8px 16px' }}>Register</Link>
                    </>
                ) : (
                    <>
                        <Link to="/dashboard" style={{ color: 'var(--secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Dashboard</Link>
                        <Link to="/history" style={{ color: 'var(--secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>History</Link>
                        {user.role === 'student' && (
                            <Link to="/profile" style={{ color: 'var(--secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Profile</Link>
                        )}
                        <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.8rem', display: window.innerWidth < 480 ? 'none' : 'block' }}>Hi, {user.name.split(' ')[0]}</span>
                        <button onClick={handleLogout} className="btn-primary" style={{ padding: '5px 12px', background: 'var(--error)', fontSize: '0.75rem' }}>
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

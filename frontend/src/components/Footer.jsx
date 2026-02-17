import React from 'react';
import { Link } from 'react-router-dom';

/**
 * --- Global Footer ---
 * Provides college contact info, quick links, and credit information.
 * Features a glassmorphism design consistent with the rest of the application.
 */
const Footer = () => {
    return (
        <footer style={{
            padding: '40px 20px',
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(12px)',
            borderTop: '1px solid var(--glass-border)',
            textAlign: 'center',
            zIndex: 100
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '40px',
                textAlign: 'left'
            }}>
                {/* Brand / Mission Column */}
                <div>
                    <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'white' }}>🎓 UniGrievance</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--secondary)', marginTop: '10px' }}>
                        Providing a secure and transparent voice for the students of MIT Muzaffarpur.
                        Redefining campus accountability.
                    </p>
                </div>

                {/* Sitemap Column */}
                <div>
                    <h4 style={{ color: 'white', marginBottom: '15px', fontSize: '1rem' }}>Quick Links</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <Link to="/" style={{ color: 'var(--secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Home</Link>
                        <Link to="/login" style={{ color: 'var(--secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Login</Link>
                        <Link to="/register" style={{ color: 'var(--secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Register</Link>
                    </div>
                </div>

                {/* Institution Info Column */}
                <div>
                    <h4 style={{ color: 'white', marginBottom: '15px', fontSize: '1rem' }}>Campus Info</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--secondary)', margin: 0 }}>
                        MIT Muzaffarpur, Bihar<br />
                        India - 842003
                    </p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--secondary)', marginTop: '10px' }}>
                        📧 contact@mitmuzaffarpur.edu
                    </p>
                </div>
            </div>

            {/* Copyright & Students Credit */}
            <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--glass-border)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                © {new Date().getFullYear()} UniGrievance | Project by MIT Muzaffarpur Students
            </div>
        </footer>
    );
};

export default Footer;

import React from 'react';
import { Link } from 'react-router-dom';

/**
 * --- Home Page ---
 * The landing page for UniGrievance.
 * Highlights the main features: Identity Protection, Smart Routing, and the 3-Day Rule.
 */
const Home = () => {
    return (
        <div style={{ padding: '0 20px' }}>
            {/* --- Hero Section ---
                Catchy headline and primary Call to Action (CTA) buttons.
            */}
            <section style={{
                minHeight: '70vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '40px 10px'
            }}>
                <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', marginBottom: '20px' }}>
                    Campus Voice, <br />
                    <span style={{
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>Redefined.</span>
                </h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '700px', lineHeight: '1.6', marginBottom: '40px' }}>
                    UniGrievance provides a secure, anonymous, and automated platform for students to voice concerns and for MIT Muzaffarpur authorities to act swiftly.
                </p>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Link to="/register" className="btn-primary" style={{ padding: '12px 30px', fontSize: '0.9rem', textDecoration: 'none' }}>Get Started</Link>
                    <Link to="/login" style={{ padding: '12px 30px', fontSize: '0.9rem', color: 'white', textDecoration: 'none', border: '1px solid var(--glass-border)', borderRadius: '12px' }}>Login</Link>
                </div>
            </section>

            {/* --- How It Works Section ---
                Explains the core value proposition (Security, Routing, Escalation).
            */}
            <section style={{ padding: '60px 10px', maxWidth: '1100px', margin: '0 auto' }}>
                <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', marginBottom: '40px' }}>How it Works</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
                    <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🛡️</div>
                        <h3>Identity Protection</h3>
                        <p>File grievances anonymously. Your identity is hidden from all authorities throughout the resolution process.</p>
                    </div>
                    <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⚖️</div>
                        <h3>Smart Routing</h3>
                        <p>Your issues are automatically directed to the specific Warden, HOD, or Official responsible for that category.</p>
                    </div>
                    <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⚡</div>
                        <h3>3-Day Escalation</h3>
                        <p>If no action is taken within 3 business days, your grievance automatically jumps to the next higher level of authority.</p>
                    </div>
                </div>
            </section>

            {/* --- Mission Section --- */}
            <section style={{ padding: '100px 0', textAlign: 'center', background: 'var(--sub-card)', borderRadius: '40px', marginBottom: '100px' }}>
                <h2 style={{ marginBottom: '20px' }}>Our Mission</h2>
                <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.1rem', color: 'var(--text-muted)' }}>
                    To foster a transparent campus environment where every student feels safe and heard. We bridge the gap between student issues and institutional action through technology.
                </p>
            </section>
        </div>
    );
};

export default Home;

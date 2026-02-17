import React, { useState, useEffect } from 'react';
import { complaintService } from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

/**
 * --- History Page ---
 * Displays a student's archive of "Closed" grievances.
 * These are grievances that have been resolved by an authority AND confirmed by the student.
 */
const History = () => {
    // --- State Management ---
    const [complaints, setComplaints] = useState([]);  // List of closed grievances
    const [loading, setLoading] = useState(true);      // Loading spinner state
    const { user } = useAuth();                        // Logged-in student info

    useEffect(() => {
        fetchHistory();
    }, []);

    /**
     * Fetch grievances with status 'closed' from the server
     */
    const fetchHistory = async () => {
        try {
            // We pass 'closed' as a filter to the API
            const { data } = await complaintService.getAll('closed');
            setComplaints(data.data);
        } catch (error) {
            toast.error('Failed to load history');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 'clamp(15px, 5vw, 40px)' }}>
            <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)' }}>📜 Grievance History</h1>
            <p style={{ color: 'var(--secondary)' }}>View all your resolved and confirmed grievances.</p>

            {/* --- History Grid --- */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
                marginTop: '30px'
            }}>
                {loading && <p>Loading history...</p>}
                {!loading && complaints.length === 0 && <p>No history found.</p>}

                {complaints.map(c => (
                    <div key={c._id} className="glass-card" style={{ padding: '25px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0 }}>{c.title}</h3>
                            <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>CLOSED</span>
                        </div>

                        {/* Journey Timeline: For history, all steps are shown as completed */}
                        <div className="timeline">
                            {['Filed', 'Warden', 'Chief Warden', 'Principal', 'Resolved'].map((step, idx) => (
                                <div key={step} className="timeline-step completed">
                                    <div className="timeline-label">{step}</div>
                                </div>
                            ))}
                        </div>

                        <p style={{ margin: '15px 0', color: 'var(--secondary)' }}>{c.description}</p>

                        {/* Final Resolution Comment from Authority */}
                        <div style={{ background: 'var(--sub-card)', border: '1px solid var(--glass-border)', padding: '15px', borderRadius: '12px', fontSize: '0.9rem' }}>
                            <strong style={{ color: 'var(--text)' }}>Resolution:</strong> {c.actionTaken}
                        </div>

                        <div style={{ marginTop: '15px', fontSize: '0.8rem', color: 'var(--secondary)' }}>
                            <div>Category: {c.category.toUpperCase()}</div>
                            <div>Finalized on: {new Date(c.updatedAt).toLocaleDateString()}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default History;

import React, { useState, useEffect } from 'react';
import { complaintService } from '../services/api';
import { toast } from 'react-toastify';

/**
 * --- Authority Dashboard ---
 * Interface for Wardens, HODs, and the Principal to manage incoming grievances.
 */
const AuthorityDashboard = () => {
    // --- State Management ---
    const [complaints, setComplaints] = useState([]);          // Active grievances assigned to authority
    const [selectedComplaint, setSelectedComplaint] = useState(null); // Currently selected for "Take Action"
    const [actionText, setActionText] = useState('');           // Resolution comment state
    const [searchTerm, setSearchTerm] = useState('');           // search bar state
    const [filterCategory, setFilterCategory] = useState('all'); // Category filter state

    // Load assigned grievances on mount
    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const { data } = await complaintService.getAll();
            setComplaints(data.data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to load grievances');
        }
    };

    /**
     * Submit a resolution for a grievance
     * @param {string} status - 'resolved' or 'in_progress'
     */
    const handleAction = async (status) => {
        if (!actionText.trim()) return toast.warn('Please provide comments');

        try {
            await complaintService.takeAction(selectedComplaint._id, {
                status,
                actionTaken: actionText
            });
            toast.success(`Grievance marked as ${status}`);
            setSelectedComplaint(null); // Close modal
            setActionText('');          // Clear input
            fetchComplaints();          // Refresh list
        } catch (error) {
            toast.error(error.response?.data?.message || 'Action failed');
        }
    };

    return (
        <div style={{ padding: 'clamp(15px, 5vw, 40px)' }}>
            <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)' }}>Authority Dashboard</h1>
            <p style={{ color: 'var(--secondary)' }}>Manage assigned grievances and student concerns.</p>

            {/* --- Statistics Overview --- */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '15px',
                margin: '20px 0 35px 0'
            }}>
                <div className="glass-card" style={{ padding: '20px', textAlign: 'center', borderLeft: '5px solid var(--primary)' }}>
                    <h2 style={{ margin: 0, color: 'var(--primary)' }}>{complaints.filter(c => c.status !== 'resolved').length}</h2>
                    <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', color: 'var(--secondary)' }}>Currently Active</p>
                </div>
                <div className="glass-card" style={{ padding: '20px', textAlign: 'center', borderLeft: '5px solid var(--success)' }}>
                    <h2 style={{ margin: 0, color: 'var(--success)' }}>{complaints.filter(c => c.status === 'resolved').length}</h2>
                    <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', color: 'var(--secondary)' }}>Resolved (Pending Confirm)</p>
                </div>
                <div className="glass-card" style={{ padding: '20px', textAlign: 'center', borderLeft: '5px solid var(--error)' }}>
                    <h2 style={{ margin: 0, color: 'var(--error)' }}>{complaints.filter(c => c.status === 'escalated').length}</h2>
                    <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', color: 'var(--secondary)' }}>Urgent / Escalated</p>
                </div>
            </div>

            {/* --- Filtering & Search --- */}
            <div style={{
                display: 'flex',
                flexDirection: window.innerWidth < 600 ? 'column' : 'row',
                gap: '15px',
                marginBottom: '30px'
            }}>
                <input
                    className="input-field"
                    placeholder="🔍 Search grievances by student or issue..."
                    style={{ margin: 0, flex: 1 }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className="input-field"
                    style={{ margin: 0, width: window.innerWidth < 600 ? '100%' : '200px' }}
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                >
                    <option value="all">All Categories</option>
                    <option value="hostel">Hostel</option>
                    <option value="academic">Academic</option>
                    <option value="general">General</option>
                </select>
            </div>

            {/* --- Grievance Cards --- */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px',
                marginTop: '30px'
            }}>
                {complaints.length === 0 && <p>No grievances assigned to you at the moment.</p>}
                {complaints
                    .filter(c => {
                        const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (!c.isAnonymous && c.createdBy.name.toLowerCase().includes(searchTerm.toLowerCase()));
                        const matchesCategory = filterCategory === 'all' || c.category === filterCategory;
                        return matchesSearch && matchesCategory;
                    })
                    .map(c => {
                        const steps = ['Filed', 'Warden', 'Chief Warden', 'Principal', 'Resolved'];
                        const currentIdx = c.status === 'resolved' || c.status === 'closed' ? 4 : c.currentLevel;

                        return (
                            <div key={c._id} className="glass-card" style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <h3 style={{ margin: 0 }}>{c.title}</h3>
                                    <span style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>
                                        {c.isAnonymous ? '👤 Anonymous' : `👤 ${c.createdBy.name} (${c.createdBy.rollNumber})`}
                                    </span>
                                </div>

                                {/* Journey Timeline Visual */}
                                <div className="timeline">
                                    {steps.map((step, idx) => (
                                        <div key={step} className={`timeline-step ${idx === currentIdx ? 'active' : ''} ${idx < currentIdx || c.status === 'resolved' || c.status === 'closed' ? 'completed' : ''}`}>
                                            <div className="timeline-label">{step}</div>
                                        </div>
                                    ))}
                                </div>

                                <p>{c.description}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--sub-card)', border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '8px' }}>
                                    <span style={{ fontSize: '0.8rem' }}>
                                        Status: <strong style={{ textTransform: 'uppercase' }}>{c.status}</strong>
                                    </span>
                                    <button onClick={() => setSelectedComplaint(c)} className="btn-primary" style={{ padding: '5px 15px' }}>
                                        Process Logic
                                    </button>
                                </div>
                            </div>
                        )
                    })}
            </div>

            {/* --- Action Modal --- */}
            {selectedComplaint && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="glass-card" style={{ background: 'var(--modal-bg)', padding: '30px', width: 'clamp(300px, 90%, 500px)' }}>
                        <h3>Process Grievance</h3>
                        <p style={{ fontSize: '0.95rem', fontWeight: 'bold', margin: '15px 0 5px 0' }}>{selectedComplaint.title}</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--secondary)', marginBottom: '20px', maxHeight: '100px', overflowY: 'auto' }}>
                            {selectedComplaint.description}
                        </p>
                        <textarea
                            className="input-field"
                            placeholder="Enter your resolution or comments..."
                            style={{ minHeight: '120px' }}
                            value={actionText}
                            onChange={(e) => setActionText(e.target.value)}
                        ></textarea>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <button onClick={() => handleAction('resolved')} className="btn-primary" style={{ flex: 1, background: 'var(--success)', justifyContent: 'center' }}>Mark Resolved</button>
                            <button onClick={() => handleAction('in_progress')} className="btn-primary" style={{ flex: 1, background: 'var(--warning)', justifyContent: 'center' }}>In Progress</button>
                            <button onClick={() => setSelectedComplaint(null)} className="btn-primary" style={{ flex: 1, background: 'var(--secondary)', justifyContent: 'center' }}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuthorityDashboard;

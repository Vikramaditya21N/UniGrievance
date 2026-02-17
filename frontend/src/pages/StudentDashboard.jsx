import React, { useState, useEffect } from 'react';
import { complaintService } from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

/**
 * --- Student Dashboard ---
 * The main hub for students to file new grievances, track active ones,
 * and view history of resolved issues.
 */
const StudentDashboard = () => {
    // --- State Management ---
    const [complaints, setComplaints] = useState([]);      // List of student's grievances
    const [showForm, setShowForm] = useState(false);        // Toggle for "File New Grievance" form
    const [formData, setFormData] = useState({              // New grievance form state
        title: '',
        description: '',
        category: 'hostel',
        isAnonymous: false
    });
    const [searchTerm, setSearchTerm] = useState('');       // Search bar state
    const [filterCategory, setFilterCategory] = useState('all'); // Category filter state
    const { user } = useAuth(); // Access logged-in student info

    // Fetch grievances on initial load
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
     * Handle submission of a new grievance
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                department: user.department,
                hostel: user.hostel
            };
            await complaintService.create(payload);
            toast.success('Grievance submitted successfully!');
            setShowForm(false);
            setFormData({ title: '', description: '', category: 'hostel', isAnonymous: false });
            fetchComplaints();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Submission failed');
        }
    };

    /**
     * Handle student feedback (Confirm Resolved or Reopen)
     */
    const handleResolution = async (id, status) => {
        try {
            await complaintService.takeAction(id, { status });
            toast.success(status === 'closed' ? 'Grievance closed' : 'Grievance reopened');
            fetchComplaints();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed');
        }
    };

    return (
        <div style={{ padding: 'clamp(15px, 5vw, 40px)' }}>
            {/* --- Header Section --- */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
                <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', margin: 0 }}>My Grievances</h1>
                <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ width: window.innerWidth < 480 ? '100%' : 'auto' }}>
                    {showForm ? 'Cancel' : '📄 File New Grievance'}
                </button>
            </div>

            {/* --- New Grievance Form --- */}
            {showForm && (
                <div className="glass-card" style={{ padding: '25px', marginBottom: '30px' }}>
                    <h3>New Grievance</h3>
                    <form onSubmit={handleSubmit}>
                        <input
                            className="input-field"
                            placeholder="Title (e.g., Fan not working)"
                            style={{ width: '100%' }}
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                        <textarea
                            className="input-field"
                            style={{ minHeight: '100px', width: '100%' }}
                            placeholder="Describe the issue in detail..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                        ></textarea>

                        <div style={{ display: 'flex', gap: '20px', marginBottom: '15px', flexWrap: 'wrap' }}>
                            <select
                                className="input-field"
                                style={{ margin: 0, flex: 1, minWidth: '200px' }}
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="hostel">Hostel Issue</option>
                                <option value="academic">Academic Issue</option>
                                <option value="general">General Issue</option>
                            </select>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                <input
                                    type="checkbox"
                                    checked={formData.isAnonymous}
                                    onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                                />
                                Anonymous Mode
                            </label>
                        </div>

                        <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Submit Grievance</button>
                    </form>
                </div>
            )}

            {/* --- Performance/Stats Overview --- */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '15px',
                margin: '20px 0 35px 0'
            }}>
                <div className="glass-card" style={{ padding: '20px', textAlign: 'center', borderLeft: '5px solid var(--primary)' }}>
                    <h2 style={{ margin: 0, color: 'var(--primary)' }}>{complaints.length}</h2>
                    <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', color: 'var(--secondary)' }}>Total Filed</p>
                </div>
                <div className="glass-card" style={{ padding: '20px', textAlign: 'center', borderLeft: '5px solid var(--success)' }}>
                    <h2 style={{ margin: 0, color: 'var(--success)' }}>{complaints.filter(c => c.status === 'resolved' || c.status === 'closed').length}</h2>
                    <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', color: 'var(--secondary)' }}>Resolved</p>
                </div>
                <div className="glass-card" style={{ padding: '20px', textAlign: 'center', borderLeft: '5px solid var(--warning)' }}>
                    <h2 style={{ margin: 0, color: 'var(--warning)' }}>{complaints.filter(c => c.status === 'pending' || c.status === 'escalated').length}</h2>
                    <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', color: 'var(--secondary)' }}>Awaiting Action</p>
                </div>
            </div>

            {/* --- Search and Filters --- */}
            <div style={{
                display: 'flex',
                flexDirection: window.innerWidth < 600 ? 'column' : 'row',
                gap: '15px',
                marginBottom: '30px'
            }}>
                <input
                    className="input-field"
                    placeholder="🔍 Search my grievances..."
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

            {/* --- Grievance Cards List --- */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                {complaints.length === 0 && <p style={{ color: 'var(--secondary)', textAlign: 'center' }}>No grievances filed yet.</p>}
                {complaints
                    .filter(c => {
                        const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            c.description.toLowerCase().includes(searchTerm.toLowerCase());
                        const matchesCategory = filterCategory === 'all' || c.category === filterCategory;
                        return matchesSearch && matchesCategory;
                    })
                    .map(c => {
                        // Logic for the visual timeline stepper
                        const steps = c.category === 'academic'
                            ? ['Filed', 'HOD', 'Principal', 'Resolved']
                            : (c.category === 'hostel'
                                ? ['Filed', 'Warden', 'Chief Warden', 'Principal', 'Resolved']
                                : ['Filed', 'Principal', 'Resolved']);

                        const currentIdx = c.status === 'resolved' || c.status === 'closed'
                            ? steps.length - 1
                            : c.currentLevel;

                        return (
                            <div key={c._id} className="glass-card" style={{ padding: 'clamp(15px, 4vw, 25px)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                                    <h4 style={{ margin: 0, flex: 1 }}>{c.title}</h4>
                                    <span style={{
                                        fontSize: '0.65rem',
                                        padding: '3px 8px',
                                        borderRadius: '100px',
                                        background: c.status === 'resolved' ? 'var(--success)' : (c.status === 'escalated' ? 'var(--error)' : 'var(--primary)'),
                                        color: 'white',
                                        textTransform: 'uppercase',
                                        fontWeight: '700'
                                    }}>
                                        {c.status}
                                    </span>
                                </div>

                                {/* Journey Timeline Stepper */}
                                <div className="timeline">
                                    {steps.map((step, idx) => (
                                        <div key={step} className={`timeline-step ${idx === currentIdx ? 'active' : ''} ${idx < currentIdx || c.status === 'resolved' || c.status === 'closed' ? 'completed' : ''}`}>
                                            <div className="timeline-label">{step}</div>
                                        </div>
                                    ))}
                                </div>

                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '10px', lineHeight: '1.5' }}>{c.description}</p>
                                <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '15px 0' }} />

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', fontSize: '0.75rem', color: 'var(--secondary)' }}>
                                    <div style={{ flex: 1 }}>
                                        <div>Assigned to: Level {c.currentLevel} Authority</div>
                                        <div>Filed on: {new Date(c.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    {c.isAnonymous && <div style={{ color: 'var(--primary)', fontWeight: '600' }}>🛡️ Identity Hidden</div>}
                                </div>

                                {/* --- Resolution Action Bar --- */}
                                {/* Shown only when an authority has marked the grievance as 'resolved' */}
                                {c.status === 'resolved' && (
                                    <div style={{ marginTop: '15px', background: 'var(--sub-card)', border: '1px solid var(--glass-border)', padding: '15px', borderRadius: '12px' }}>
                                        <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: 'var(--text)' }}><strong>Authority Strategy:</strong> {c.actionTaken}</p>
                                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                            <button
                                                onClick={() => handleResolution(c._id, 'closed')}
                                                className="btn-primary"
                                                style={{ background: 'var(--success)', padding: '6px 12px', fontSize: '0.75rem', flex: 1 }}
                                            >
                                                Confirm Resolved
                                            </button>
                                            <button
                                                onClick={() => handleResolution(c._id, 'reopened')}
                                                className="btn-primary"
                                                style={{ background: 'var(--error)', padding: '6px 12px', fontSize: '0.75rem', flex: 1 }}
                                            >
                                                Reopen Case
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {c.status === 'closed' && (
                                    <div style={{ marginTop: '10px', color: 'var(--success)', fontWeight: 'bold', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        ✓ Resolution Confirmed
                                    </div>
                                )}
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default StudentDashboard;

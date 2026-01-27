import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Form } from 'react-bootstrap';
import { complaintService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns';
import { useNavigate, Link } from 'react-router-dom';

const AuthorityDashboard = () => {
  const { token, user, logout } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusData, setStatusData] = useState({ status: '', resolutionDetails: '' });
  const [filterStatus, setFilterStatus] = useState('');
  const navigate = useNavigate();

  // Redirect non-authorities to dashboard
  useEffect(() => {
    if (user && user.role === 'student') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [complaints, filterStatus]);

  const fetchComplaints = async () => {
    try {
      // Get all complaints
      const response = await complaintService.getAllComplaints(token);
      
      // Filter for complaints assigned to this authority or escalated to them
      const filtered = response.data.filter(complaint => 
        complaint.assignedTo?._id === user?._id || 
        complaint.assignedToHigherAuthority?._id === user?._id
      );
      
      setComplaints(filtered);
    } catch (error) {
      toast.error('Failed to fetch complaints');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = complaints;
    if (filterStatus) {
      filtered = filtered.filter(c => c.status === filterStatus);
    }
    setFilteredComplaints(filtered);
  };

  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setShowModal(true);
  };

  const handleUpdateStatus = (complaint) => {
    setSelectedComplaint(complaint);
    setStatusData({ status: complaint.status, resolutionDetails: '' });
    setShowStatusModal(true);
  };

  const submitStatusUpdate = async () => {
    try {
      await complaintService.updateComplaintStatus(selectedComplaint._id, statusData, token);
      toast.success('Complaint status updated');
      setShowStatusModal(false);
      fetchComplaints();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      submitted: 'info',
      assigned: 'warning',
      in_progress: 'primary',
      resolved: 'success',
      escalated: 'danger',
      closed: 'dark',
    };
    return <Badge bg={variants[status] || 'secondary'}>{status.toUpperCase()}</Badge>;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container fluid className="py-4">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <Row className="mb-4 align-items-center">
        <Col>
          <h1>Authority Dashboard</h1>
          <p className="text-muted">
            Welcome, {user?.name} | Role: {Array.isArray(user?.authorityType) 
              ? user?.authorityType?.map(t => t.replace(/_/g, ' ').toUpperCase()).join(', ')
              : user?.authorityType?.replace(/_/g, ' ').toUpperCase()}
          </p>
        </Col>
        <Col className="text-end">
          {user?.role === 'higher_authority' && (
            <Link to="/manage-faculty" className="btn btn-warning me-2">
              Manage Faculty
            </Link>
          )}
          <Link to="/profile" className="btn btn-info me-2">
            My Profile
          </Link>
          <Button variant="outline-danger" onClick={handleLogout}>
            Logout
          </Button>
        </Col>
      </Row>

      {/* Stats */}
      <Row className="mb-4">
        <Col md="3">
          <Card>
            <Card.Body>
              <h6 className="text-muted">Total Complaints</h6>
              <h3>{complaints.length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md="3">
          <Card>
            <Card.Body>
              <h6 className="text-muted">Pending</h6>
              <h3>{complaints.filter(c => c.status === 'submitted').length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md="3">
          <Card>
            <Card.Body>
              <h6 className="text-muted">In Progress</h6>
              <h3>{complaints.filter(c => c.status === 'in_progress').length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md="3">
          <Card>
            <Card.Body>
              <h6 className="text-muted">Resolved</h6>
              <h3>{complaints.filter(c => c.status === 'resolved').length}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filter */}
      <Card className="mb-4">
        <Card.Body>
          <Form.Group>
            <Form.Label>Filter by Status</Form.Label>
            <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">All</option>
              <option value="submitted">Submitted</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="escalated">Escalated</option>
            </Form.Select>
          </Form.Group>
        </Card.Body>
      </Card>

      {/* Complaints Table */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">Complaints</h5>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <p>Loading...</p>
          ) : filteredComplaints.length === 0 ? (
            <p>No complaints found.</p>
          ) : (
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Filed Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((complaint) => (
                  <tr key={complaint._id}>
                    <td>{complaint.complaintId}</td>
                    <td>{complaint.studentId.name}</td>
                    <td>{complaint.title}</td>
                    <td>{getStatusBadge(complaint.status)}</td>
                    <td>
                      <Badge bg={complaint.priority === 'urgent' ? 'danger' : 'warning'}>
                        {complaint.priority.toUpperCase()}
                      </Badge>
                    </td>
                    <td>{format(new Date(complaint.createdAt), 'dd MMM yyyy')}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="me-2"
                        onClick={() => handleViewDetails(complaint)}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-success"
                        onClick={() => handleUpdateStatus(complaint)}
                      >
                        Update
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedComplaint?.complaintId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedComplaint && (
            <div>
              <h5>{selectedComplaint.title}</h5>
              <p><strong>Student:</strong> {selectedComplaint.studentId.name} ({selectedComplaint.studentId.rollNumber})</p>
              <p><strong>Status:</strong> {getStatusBadge(selectedComplaint.status)}</p>
              <p><strong>Category:</strong> {selectedComplaint.category}</p>
              <p><strong>Description:</strong> {selectedComplaint.description}</p>
              <p><strong>Location:</strong> {selectedComplaint.location}</p>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Status Update Modal */}
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={statusData.status}
              onChange={(e) => setStatusData({ ...statusData, status: e.target.value })}
            >
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </Form.Select>
          </Form.Group>

          {statusData.status === 'resolved' && (
            <Form.Group className="mb-3">
              <Form.Label>Resolution Details</Form.Label>
              <Form.Control
                as="textarea"
                rows="3"
                value={statusData.resolutionDetails}
                onChange={(e) => setStatusData({ ...statusData, resolutionDetails: e.target.value })}
                placeholder="Describe the resolution..."
              />
            </Form.Group>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submitStatusUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AuthorityDashboard;

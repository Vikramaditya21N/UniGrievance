import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Form } from 'react-bootstrap';
import { complaintService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns';
import { useNavigate, Link } from 'react-router-dom';

const StudentDashboard = () => {
  const { token, user, logout } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Redirect non-students to appropriate dashboard
  useEffect(() => {
    if (user && user.role !== 'student') {
      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (user.role === 'authority' || user.role === 'higher_authority') {
        navigate('/authority-dashboard');
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await complaintService.getMyComplaints(token);
      setComplaints(response.data);
    } catch (error) {
      toast.error('Failed to fetch complaints');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setShowModal(true);
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
          <h1>My Complaints</h1>
          <p className="text-muted">Welcome, {user?.name}! File and track your complaints here.</p>
        </Col>
        <Col className="text-end">
          {user?.role === 'student' && (
            <Link to="/file-complaint" className="btn btn-success me-2">
              + File New Complaint
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

      {/* Stats Cards */}
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
              <h6 className="text-muted">Open</h6>
              <h3>{complaints.filter(c => ['submitted', 'assigned', 'in_progress'].includes(c.status)).length}</h3>
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
        <Col md="3">
          <Card>
            <Card.Body>
              <h6 className="text-muted">Escalated</h6>
              <h3>{complaints.filter(c => c.status === 'escalated').length}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Complaints Table */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">All Complaints</h5>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <p>Loading...</p>
          ) : complaints.length === 0 ? (
            <p>No complaints filed yet.</p>
          ) : (
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Filed Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((complaint) => (
                  <tr key={complaint._id}>
                    <td>{complaint.complaintId}</td>
                    <td>{complaint.title}</td>
                    <td>{complaint.category}</td>
                    <td>{getStatusBadge(complaint.status)}</td>
                    <td>
                      <Badge bg={complaint.priority === 'urgent' ? 'danger' : complaint.priority === 'high' ? 'warning' : 'info'}>
                        {complaint.priority.toUpperCase()}
                      </Badge>
                    </td>
                    <td>{format(new Date(complaint.createdAt), 'dd MMM yyyy')}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => handleViewDetails(complaint)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Complaint Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedComplaint?.complaintId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedComplaint && (
            <div>
              <h5>{selectedComplaint.title}</h5>
              <p><strong>Status:</strong> {getStatusBadge(selectedComplaint.status)}</p>
              <p><strong>Category:</strong> {selectedComplaint.category}</p>
              <p><strong>Description:</strong> {selectedComplaint.description}</p>
              <p><strong>Location:</strong> {selectedComplaint.location}</p>
              {selectedComplaint.assignedTo && (
                <p><strong>Assigned To:</strong> {selectedComplaint.assignedTo.name}</p>
              )}
              {selectedComplaint.timeline && (
                <>
                  <p><strong>Resolution Deadline:</strong> {format(new Date(selectedComplaint.timeline.assignmentDeadline), 'dd MMM yyyy')}</p>
                  <p><strong>Escalation Deadline:</strong> {format(new Date(selectedComplaint.timeline.escalationDeadline), 'dd MMM yyyy')}</p>
                </>
              )}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default StudentDashboard;

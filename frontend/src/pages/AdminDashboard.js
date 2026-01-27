import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Form } from 'react-bootstrap';
import { complaintService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns';
import { useNavigate, Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { token, user, logout } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchComplaints();
    fetchStats();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await complaintService.getAllComplaints(token);
      setComplaints(response.data);
    } catch (error) {
      toast.error('Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await complaintService.getStatistics(token);
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch statistics');
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
          <h1>Admin Dashboard</h1>
          <p className="text-muted">Welcome, {user?.name}</p>
        </Col>
        <Col className="text-end">
          <Link to="/profile" className="btn btn-info me-2">
            My Profile
          </Link>
          <Button variant="outline-danger" onClick={handleLogout}>
            Logout
          </Button>
        </Col>
      </Row>

      {/* Statistics */}
      <Row className="mb-4">
        <Col md="2">
          <Card>
            <Card.Body className="text-center">
              <h6 className="text-muted">Total</h6>
              <h3>{stats.total || 0}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md="2">
          <Card>
            <Card.Body className="text-center">
              <h6 className="text-muted">Submitted</h6>
              <h3>{stats.submitted || 0}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md="2">
          <Card>
            <Card.Body className="text-center">
              <h6 className="text-muted">Assigned</h6>
              <h3>{stats.assigned || 0}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md="2">
          <Card>
            <Card.Body className="text-center">
              <h6 className="text-muted">In Progress</h6>
              <h3>{stats.inProgress || 0}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md="2">
          <Card>
            <Card.Body className="text-center">
              <h6 className="text-muted">Resolved</h6>
              <h3>{stats.resolved || 0}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md="2">
          <Card>
            <Card.Body className="text-center">
              <h6 className="text-muted">Escalated</h6>
              <h3>{stats.escalated || 0}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Category Distribution */}
      {stats.byCategory && stats.byCategory.length > 0 && (
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">Complaints by Category</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              {stats.byCategory.map((cat) => (
                <Col md="2" key={cat._id}>
                  <Card className="text-center">
                    <Card.Body>
                      <h6>{cat._id}</h6>
                      <h4>{cat.count}</h4>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* All Complaints */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">All Complaints</h5>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <p>Loading...</p>
          ) : complaints.length === 0 ? (
            <p>No complaints found.</p>
          ) : (
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Filed Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {complaints.slice(0, 50).map((complaint) => (
                  <tr key={complaint._id}>
                    <td>{complaint.complaintId}</td>
                    <td>{complaint.studentId?.name}</td>
                    <td>{complaint.title}</td>
                    <td>{complaint.category}</td>
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

      {/* Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedComplaint?.complaintId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedComplaint && (
            <div>
              <h5>{selectedComplaint.title}</h5>
              <p><strong>Student:</strong> {selectedComplaint.studentId?.name}</p>
              <p><strong>Department:</strong> {selectedComplaint.studentId?.department}</p>
              <p><strong>Status:</strong> {getStatusBadge(selectedComplaint.status)}</p>
              <p><strong>Category:</strong> {selectedComplaint.category}</p>
              <p><strong>Priority:</strong> {selectedComplaint.priority}</p>
              <p><strong>Description:</strong> {selectedComplaint.description}</p>
              <p><strong>Location:</strong> {selectedComplaint.location}</p>
              {selectedComplaint.assignedTo && (
                <p><strong>Assigned To:</strong> {selectedComplaint.assignedTo.name}</p>
              )}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;

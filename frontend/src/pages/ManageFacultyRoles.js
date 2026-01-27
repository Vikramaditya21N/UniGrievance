import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Badge, Alert } from 'react-bootstrap';
import { userService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageFacultyRoles = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);

  const authorityTypes = [
    { value: 'department_head', label: 'Department Head' },
    { value: 'hostel_warden', label: 'Hostel Warden' },
    { value: 'canteen_manager', label: 'Canteen Manager' },
    { value: 'security_chief', label: 'Security Chief' },
  ];

  // Redirect non-principals/directors
  useEffect(() => {
    if (user && user.role !== 'higher_authority') {
      toast.error('Only principals/directors can manage faculty roles');
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      const response = await userService.getAllFaculty(token);
      setFaculty(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch faculty list');
      console.error(error);
      setLoading(false);
    }
  };

  const handleEditRoles = (facultyMember) => {
    setSelectedFaculty(facultyMember);
    setSelectedRoles(facultyMember.authorityType || []);
    setShowModal(true);
  };

  const handleRoleToggle = (roleValue) => {
    setSelectedRoles(prev =>
      prev.includes(roleValue)
        ? prev.filter(r => r !== roleValue)
        : [...prev, roleValue]
    );
  };

  const handleSaveRoles = async () => {
    if (selectedRoles.length === 0) {
      toast.error('Please select at least one role');
      return;
    }

    setSaving(true);
    try {
      await userService.updateFacultyRoles(selectedFaculty._id, selectedRoles, token);
      
      // Update local state
      const updatedFaculty = faculty.map(f =>
        f._id === selectedFaculty._id ? { ...f, authorityType: selectedRoles } : f
      );
      setFaculty(updatedFaculty);
      
      toast.success(`Roles updated for ${selectedFaculty.name}`);
      setShowModal(false);
    } catch (error) {
      toast.error('Failed to update roles');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Container className="py-5"><p>Loading faculty list...</p></Container>;
  }

  if (user?.role !== 'higher_authority') {
    return null;
  }

  return (
    <Container fluid className="py-4">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <Row className="mb-4 align-items-center">
        <Col>
          <h1>Manage Faculty Roles</h1>
          <p className="text-muted">Assign and manage authority roles for faculty members</p>
        </Col>
        <Col className="text-end">
          <Button variant="outline-secondary" onClick={() => navigate('/authority-dashboard')}>
            Back to Dashboard
          </Button>
        </Col>
      </Row>

      {/* Faculty Table */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              {faculty.length === 0 ? (
                <Alert variant="info">No faculty members found</Alert>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Department</th>
                      <th>Assigned Roles</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {faculty.map(f => (
                      <tr key={f._id}>
                        <td>
                          <strong>{f.name}</strong>
                        </td>
                        <td>{f.email}</td>
                        <td>{f.department}</td>
                        <td>
                          {f.authorityType && f.authorityType.length > 0 ? (
                            f.authorityType.map(role => (
                              <Badge key={role} bg="info" className="me-2 mb-2">
                                {role.replace(/_/g, ' ').toUpperCase()}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted">No roles assigned</span>
                          )}
                        </td>
                        <td>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleEditRoles(f)}
                          >
                            Edit Roles
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Edit Roles Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Assign Roles to {selectedFaculty?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Select Roles (Select Multiple)</Form.Label>
              <div className="border p-3 rounded">
                {authorityTypes.map(role => (
                  <Form.Check
                    key={role.value}
                    type="checkbox"
                    label={role.label}
                    value={role.value}
                    checked={selectedRoles.includes(role.value)}
                    onChange={() => handleRoleToggle(role.value)}
                    className="mb-2"
                  />
                ))}
              </div>
              {selectedRoles.length === 0 && (
                <Form.Text className="text-danger d-block mt-2">
                  Please select at least one role
                </Form.Text>
              )}
            </Form.Group>

            <Alert variant="light">
              <strong>Selected Roles:</strong>
              <div className="mt-2">
                {selectedRoles.length === 0 ? (
                  <span className="text-muted">None</span>
                ) : (
                  selectedRoles.map(role => (
                    <Badge key={role} bg="success" className="me-2 mb-2">
                      {role.replace(/_/g, ' ').toUpperCase()}
                    </Badge>
                  ))
                )}
              </div>
            </Alert>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveRoles}
            disabled={saving || selectedRoles.length === 0}
          >
            {saving ? 'Saving...' : 'Save Roles'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageFacultyRoles;

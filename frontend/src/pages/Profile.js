import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import { userService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    department: '',
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userService.getUserProfile(token);
      setProfile(response.data);
      setFormData({
        name: response.data.name,
        phone: response.data.phone,
        department: response.data.department,
      });
    } catch (error) {
      toast.error('Failed to fetch profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await userService.updateProfile(formData, token);
      setProfile({ ...profile, ...formData });
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const getRoleDisplay = () => {
    if (profile?.role === 'student') {
      return 'Student';
    } else if (profile?.role === 'authority') {
      const types = Array.isArray(profile?.authorityType) 
        ? profile.authorityType.map(t => t.replace(/_/g, ' ').toUpperCase()).join(', ')
        : profile?.authorityType?.replace(/_/g, ' ').toUpperCase();
      return `Faculty - ${types}`;
    } else if (profile?.role === 'higher_authority') {
      const types = Array.isArray(profile?.authorityType) 
        ? profile.authorityType.map(t => t.replace(/_/g, ' ').toUpperCase()).join(', ')
        : profile?.authorityType?.replace(/_/g, ' ').toUpperCase();
      return `Administration - ${types}`;
    } else if (profile?.role === 'admin') {
      return 'System Administrator';
    }
  };

  if (loading) {
    return <Container className="py-5"><p>Loading profile...</p></Container>;
  }

  return (
    <Container className="py-5">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Row className="mb-4">
        <Col md="8" className="mx-auto">
          <Card>
            <Card.Header className="bg-primary text-white">
              <h3 className="mb-0">My Profile</h3>
            </Card.Header>
            <Card.Body>
              {/* Profile Info */}
              <Row className="mb-4">
                <Col md="6">
                  <div className="mb-3">
                    <label className="text-muted small">Full Name</label>
                    <h5>{profile?.name}</h5>
                  </div>
                </Col>
                <Col md="6">
                  <div className="mb-3">
                    <label className="text-muted small">Email</label>
                    <h5>{profile?.email}</h5>
                  </div>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col md="6">
                  <div className="mb-3">
                    <label className="text-muted small">Role</label>
                    <div>
                      <Badge bg="info">{getRoleDisplay()}</Badge>
                    </div>
                  </div>
                </Col>
                <Col md="6">
                  <div className="mb-3">
                    <label className="text-muted small">Status</label>
                    <div>
                      {profile?.isVerified ? (
                        <Badge bg="success">Verified</Badge>
                      ) : (
                        <Badge bg="warning">Pending Verification</Badge>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>

              {profile?.role === 'student' && (
                <Row className="mb-4">
                  <Col md="6">
                    <div className="mb-3">
                      <label className="text-muted small">Roll Number</label>
                      <h5>{profile?.rollNumber}</h5>
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="mb-3">
                      <label className="text-muted small">Department</label>
                      <h5>{profile?.department}</h5>
                    </div>
                  </Col>
                </Row>
              )}

              {(profile?.role === 'authority' || profile?.role === 'higher_authority') && (
                <Row className="mb-4">
                  <Col md="6">
                    <div className="mb-3">
                      <label className="text-muted small">Employee ID</label>
                      <h5>{profile?.rollNumber}</h5>
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="mb-3">
                      <label className="text-muted small">Department</label>
                      <h5>{profile?.department}</h5>
                    </div>
                  </Col>
                </Row>
              )}

              <hr className="my-4" />

              {/* Editable Section */}
              {!editing ? (
                <>
                  <Row className="mb-3">
                    <Col md="6">
                      <div className="mb-3">
                        <label className="text-muted small">Phone Number</label>
                        <h5>{profile?.phone}</h5>
                      </div>
                    </Col>
                  </Row>
                  <Button variant="primary" onClick={() => setEditing(true)}>
                    Edit Profile
                  </Button>
                </>
              ) : (
                <>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Department</Form.Label>
                      <Form.Control
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <div className="d-flex gap-2">
                      <Button 
                        variant="success" 
                        onClick={handleSave}
                        disabled={saving}
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button 
                        variant="secondary" 
                        onClick={() => {
                          setEditing(false);
                          setFormData({
                            name: profile?.name,
                            phone: profile?.phone,
                            department: profile?.department,
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Form>
                </>
              )}
            </Card.Body>
          </Card>

          {/* Account Info Card */}
          <Card className="mt-4">
            <Card.Header className="bg-secondary text-white">
              <h5 className="mb-0">Account Information</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md="6">
                  <div className="mb-3">
                    <label className="text-muted small">Member Since</label>
                    <h6>{new Date(profile?.createdAt).toLocaleDateString()}</h6>
                  </div>
                </Col>
                <Col md="6">
                  <div className="mb-3">
                    <label className="text-muted small">Account Status</label>
                    <Badge bg="success">Active</Badge>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;

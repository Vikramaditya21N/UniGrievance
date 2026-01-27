import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNumber: '',
    password: '',
    phone: '',
    department: '',
    role: 'student',
    authorityType: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAuthorityTypeChange = (type) => {
    setFormData(prev => {
      const updated = prev.authorityType.includes(type)
        ? prev.authorityType.filter(t => t !== type)
        : [...prev.authorityType, type];
      return { ...prev, authorityType: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.register(formData);
      toast.success('Registration successful! Please check your email to verify.');
      navigate('/login');
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <ToastContainer position="top-right" autoClose={3000} />
      <Card style={{ maxWidth: '500px', margin: '0 auto' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Register</h2>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>User Type</Form.Label>
              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="student">Student</option>
                <option value="authority">Faculty/Staff</option>
                <option value="higher_authority">Administration</option>
              </Form.Select>
            </Form.Group>

            {formData.role === 'authority' && (
              <Form.Group className="mb-3">
                <Form.Label>Position/Designation (Select Multiple)</Form.Label>
                <div className="border p-3 rounded">
                  <Form.Check
                    type="checkbox"
                    label="Department Head"
                    value="department_head"
                    checked={formData.authorityType.includes('department_head')}
                    onChange={(e) => handleAuthorityTypeChange('department_head')}
                    className="mb-2"
                  />
                  <Form.Check
                    type="checkbox"
                    label="Hostel Warden"
                    value="hostel_warden"
                    checked={formData.authorityType.includes('hostel_warden')}
                    onChange={(e) => handleAuthorityTypeChange('hostel_warden')}
                    className="mb-2"
                  />
                  <Form.Check
                    type="checkbox"
                    label="Canteen Manager"
                    value="canteen_manager"
                    checked={formData.authorityType.includes('canteen_manager')}
                    onChange={(e) => handleAuthorityTypeChange('canteen_manager')}
                    className="mb-2"
                  />
                  <Form.Check
                    type="checkbox"
                    label="Security Chief"
                    value="security_chief"
                    checked={formData.authorityType.includes('security_chief')}
                    onChange={(e) => handleAuthorityTypeChange('security_chief')}
                  />
                </div>
                {formData.authorityType.length === 0 && (
                  <Form.Text className="text-danger d-block mt-2">
                    Please select at least one position
                  </Form.Text>
                )}
              </Form.Group>
            )}

            {formData.role === 'higher_authority' && (
              <Form.Group className="mb-3">
                <Form.Label>Position/Designation</Form.Label>
                <Form.Select
                  name="authorityType"
                  value={formData.authorityType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Position</option>
                  <option value="principal">Principal</option>
                  <option value="director">Director</option>
                </Form.Select>
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {formData.role === 'student' && (
              <Form.Group className="mb-3">
                <Form.Label>Roll Number</Form.Label>
                <Form.Control
                  type="text"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            )}

            {formData.role !== 'student' && (
              <Form.Group className="mb-3">
                <Form.Label>Employee ID</Form.Label>
                <Form.Control
                  type="text"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  placeholder="e.g., DEPT001, PRINCIPAL001"
                  required
                />
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Department</Form.Label>
              <Form.Select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                <option value="CSE">Computer Science</option>
                <option value="ECE">Electronics</option>
                <option value="ME">Mechanical</option>
                <option value="CE">Civil</option>
                <option value="EEE">Electrical</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                minLength="6"
                required
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100 mb-3"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </Form>

          <p className="text-center">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register;

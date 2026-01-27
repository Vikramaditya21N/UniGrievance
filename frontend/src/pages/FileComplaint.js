import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { complaintService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FileComplaint = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirect non-students
  useEffect(() => {
    if (user && user.role !== 'student') {
      toast.error('Only students can file complaints');
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await complaintService.createComplaint(formData, token);
      setSuccess(`Complaint submitted successfully! ID: ${response.data.complaint.complaintId}`);
      toast.success('Complaint filed successfully!');
      setFormData({ category: '', title: '', description: '', location: '' });
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to submit complaint';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <ToastContainer position="top-right" autoClose={3000} />
      <Card style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Card.Body>
          <h2 className="mb-4">File a Complaint</h2>
          
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option value="hostel">Hostel (Hostel Warden)</option>
                <option value="infrastructure">Infrastructure (Department Head)</option>
                <option value="faculty">Faculty (Department Head)</option>
                <option value="academic">Academic (Department Head)</option>
                <option value="canteen">Canteen (Canteen Manager)</option>
                <option value="security">Security (Security Chief)</option>
                <option value="other">Other (Principal)</option>
              </Form.Select>
              <Form.Text className="text-muted">
                Select the category - complaint will be routed to respective in-charge
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Brief title of complaint"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                placeholder="Detailed description of the issue"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Where did the issue occur?"
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Complaint'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default FileComplaint;

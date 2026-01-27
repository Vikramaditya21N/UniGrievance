import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const CollegeNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar expand="lg" sticky="top" className="navbar-college">
      <Container fluid>
        <Navbar.Brand as={Link} to="/dashboard" className="navbar-brand-college">
          <span className="college-icon">🎓</span>
          UniGrievance
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto navbar-nav-college">
            {user && (
              <>
                <span className="navbar-user-info">
                  Welcome, <strong>{user?.name}</strong>
                </span>
                
                <Link to="/profile" className="nav-link">
                  👤 My Profile
                </Link>
                
                {user?.role === 'student' && (
                  <Link to="/dashboard" className="nav-link">
                    📋 My Complaints
                  </Link>
                )}
                
                {(user?.role === 'authority' || user?.role === 'higher_authority') && (
                  <Link to="/authority-dashboard" className="nav-link">
                    ⚙️ Dashboard
                  </Link>
                )}
                
                {user?.role === 'higher_authority' && (
                  <Link to="/manage-faculty" className="nav-link">
                    👨‍🏫 Manage Faculty
                  </Link>
                )}
                
                {user?.role === 'admin' && (
                  <Link to="/admin-dashboard" className="nav-link">
                    🔧 Admin
                  </Link>
                )}
                
                <button 
                  onClick={handleLogout}
                  className="nav-link nav-logout"
                  style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                >
                  🚪 Logout
                </button>
              </>
            )}
            
            {!user && (
              <>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/register" className="nav-link">
                  Register
                </Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CollegeNavbar;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import AuthorityDashboard from './pages/AuthorityDashboard';
import History from './pages/History';
import Profile from './pages/Profile';
import Home from './pages/Home';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * --- Route Guard Component ---
 * Protects specific routes from unauthorized access.
 */
const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  // Check if user has the required role (e.g., student-only pages)
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/dashboard" />;
  return children;
};

/**
 * --- Smart Dashboard Redirector ---
 * Decides whether to show the Student or Authority dashboard based on logged-in role.
 */
const DashboardRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return user.role === 'student' ? <StudentDashboard /> : <AuthorityDashboard />;
};

/**
 * --- Main Application Component ---
 * Configures the router, global layout (Navbar/Footer), and theme.
 */
function App() {
  return (
    <Router>
      <AuthProvider>
        {/* Main layout container with sticky footer support */}
        <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />

          <div style={{ flex: 1 }}>
            <Routes>
              {/* Authenticated Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<DashboardRedirect />} />
              <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute allowedRoles={['student']}><Profile /></PrivateRoute>} />

              {/* Public Route */}
              <Route path="/" element={<Home />} />
            </Routes>
          </div>

          <Footer />

          {/* Global notification toast container */}
          <ToastContainer position="bottom-right" />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

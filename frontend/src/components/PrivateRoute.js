import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const PrivateRoute = ({ children, requiredRole }) => {
  const { user, token } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user?.role !== requiredRole && 
      requiredRole !== 'authority' && requiredRole !== 'higher_authority') {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

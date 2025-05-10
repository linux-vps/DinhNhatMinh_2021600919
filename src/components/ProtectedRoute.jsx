import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // const token = localStorage.getItem('token');
  const token = localStorage.getItem('token');
  // console.log('ProtectedRoute - Token:', token);
  
  if (!token) {
    // console.log('ProtectedRoute - No token found, redirecting to login');
    return <Navigate to="/" replace />;
  }

  // console.log('ProtectedRoute - Token found, rendering children');
  return children;
};

export default ProtectedRoute; 
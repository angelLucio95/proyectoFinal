import React from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Cambia esto

const PrivateRoute = ({ children, roles }) => {
  const token = localStorage.getItem('token');
  let userRole = '';

  if (token) {
    try {
      const decoded = jwtDecode(token); // Cambia esto
      userRole = decoded.role;
      console.log('Decoded token in PrivateRoute:', decoded);
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  if (!token || !roles.includes(userRole)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;

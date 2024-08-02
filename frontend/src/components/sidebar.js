import React from 'react';
import { NavLink } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode'; // Ajuste aquí

const Sidebar = () => {
  const token = localStorage.getItem('token');
  let role = '';

  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role;
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  return (
    <div className="d-flex flex-column p-3 bg-light" style={{ width: '250px', height: '100vh' }}>
      <h4>Dashboard</h4>
      <Nav className="flex-column">
        <NavLink to="/dashboard/weather" className="nav-link">
          Clima
        </NavLink>
        {role === 'Master' && (
          <NavLink to="/dashboard/user-management" className="nav-link">
            Gestión de usuarios
          </NavLink>
        )}
        {/* Agrega más enlaces aquí para futuros componentes */}
      </Nav>
    </div>
  );
};

export default Sidebar;

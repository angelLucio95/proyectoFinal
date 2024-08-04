import React from 'react';
import { NavLink } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import {jwtDecode} from 'jwt-decode';

const Sidebar = () => {
  const token = localStorage.getItem('token');
  let role = '';
  let permissions = [];


  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role;
      permissions = decoded.permissions || [];
      console.log('Decoded token:', decoded);
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  } else {
    console.error('No token found');
  }

  console.log('User role:', role);
  console.log('User permissions:', permissions);

  return (
    <div className="d-flex flex-column p-3 bg-light" style={{ width: '250px', height: '100vh' }}>
      <h4>Dashboard</h4>
      <Nav className="flex-column">
        <NavLink to="/dashboard/weather" className="nav-link">
          Clima
        </NavLink>
        {(role === 'Master' || permissions.includes('readUsers')) && (
          <NavLink to="/dashboard/user-management" className="nav-link">
            Gestión de usuarios
          </NavLink>
        )}
        {(role === 'Master' || permissions.includes('readRoles')) && (
          <NavLink to="/dashboard/role-management" className="nav-link">
            Gestión de roles
          </NavLink>
        )}
        {(role === 'Master' || permissions.includes('updateUsers')) && (
          <NavLink to="/dashboard/role-assignment" className="nav-link">
            Asignación de roles
          </NavLink>
        )}
        {(role === 'Master' || permissions.includes('readHouses')) && (
          <NavLink to="/dashboard/house-catalog" className="nav-link">
            Catalogo de casas
          </NavLink>
        )}
        {(role === 'Master' || permissions.includes('createHouses')) && (
          <NavLink to="/dashboard/house-management" className="nav-link">
            Gestión de casas
          </NavLink>
        )}
      </Nav>
    </div>
  );
};

export default Sidebar;

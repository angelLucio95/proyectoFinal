import React from 'react';
import { NavLink } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import { FaCloudSun, FaUsers, FaUserShield, FaUserTie, FaHome, FaBuilding, FaBars, FaSignOutAlt } from 'react-icons/fa';
import './styles/Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = React.useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

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
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <button className="toggle-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>
        {isOpen && <h4 className="dashboard-text">Dashboard</h4>}
      </div>
      <Nav className="flex-column nav-links">
        <NavLink to="/dashboard/weather" className="nav-link">
          <FaCloudSun /> {isOpen && 'Clima'}
        </NavLink>
        {(role === 'Master' || permissions.includes('readUsers')) && (
          <NavLink to="/dashboard/user-management" className="nav-link">
            <FaUsers /> {isOpen && 'Gestión de usuarios'}
          </NavLink>
        )}
        {(role === 'Master' || permissions.includes('readRoles')) && (
          <NavLink to="/dashboard/role-management" className="nav-link">
            <FaUserShield /> {isOpen && 'Gestión de roles'}
          </NavLink>
        )}
        {(role === 'Master' || permissions.includes('updateUsers')) && (
          <NavLink to="/dashboard/role-assignment" className="nav-link">
            <FaUserTie /> {isOpen && 'Asignación de roles'}
          </NavLink>
        )}
        {(role === 'Master' || permissions.includes('readHouses')) && (
          <NavLink to="/dashboard/house-catalog" className="nav-link">
            <FaHome /> {isOpen && 'Catalogo de casas'}
          </NavLink>
        )}
        {(role === 'Master' || permissions.includes('createHouses')) && (
          <NavLink to="/dashboard/house-management" className="nav-link">
            <FaBuilding /> {isOpen && 'Gestión de casas'}
          </NavLink>
        )}
      </Nav>
      <div className="sidebar-footer">
        {isOpen && <p>Usuario: {role}</p>}
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> {isOpen && 'Logout'}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

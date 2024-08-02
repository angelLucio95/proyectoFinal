import React from 'react';
import { NavLink } from 'react-router-dom';
import { Nav } from 'react-bootstrap';

const Sidebar = () => {
  return (
    <div className="d-flex flex-column p-3 bg-light" style={{ width: '250px', height: '100vh' }}>
      <h4>Dashboard</h4>
      <Nav className="flex-column">
        <NavLink to="/dashboard/weather" className="nav-link">
          Clima
        </NavLink>
        {/* Agrega más enlaces aquí para futuros componentes */}
      </Nav>
    </div>
  );
};

export default Sidebar;

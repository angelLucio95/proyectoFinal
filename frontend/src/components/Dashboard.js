import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Sidebar from './sidebar';
import Weather from './Weather';
import UserManagement from './UserManagement';
import RoleManagement from './RoleManagement';
import RoleAssignment from './RoleAssignment';
import HouseManagement from './HouseManagement';
import HouseCatalog from './HouseCatalog';

const Dashboard = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-3">
        <Routes>
          <Route path="weather" element={<Weather />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="role-management" element={<RoleManagement />} />
          <Route path="role-assignment" element={<RoleAssignment />} />
          <Route path="house-management" element={<HouseManagement />} />
          <Route path="house-catalog" element={<HouseCatalog />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;

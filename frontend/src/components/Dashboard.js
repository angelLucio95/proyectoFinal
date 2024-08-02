import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Sidebar from './sidebar';
import Weather from './Weather';

const Dashboard = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-3">
        <Routes>
          <Route path="weather" element={<Weather />} />
          {/* Agrega más rutas aquí para futuros componentes */}
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;

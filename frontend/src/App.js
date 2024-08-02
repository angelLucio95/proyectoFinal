import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import RestablecerPassword from './components/RestablecerPassword';
import ResetPassword from './components/ResetPassword';
import Weather from './components/Weather';

function App() {
  return (
    <Router>
      <div className="App">
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard/*" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/restablecer-password" element={<RestablecerPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/weather" element={<PrivateRoute><Weather /></PrivateRoute>} /> {/* Añadir la ruta Weather */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

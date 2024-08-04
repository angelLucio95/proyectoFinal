import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaLock } from 'react-icons/fa';
import './styles/ResetPassword.css';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden.');
      return;
    }
    try {
      const res = await axios.post(`http://localhost:5001/api/users/reset-password/${token}`, { password });
      setMessage(res.data.message);
      toast.success('Contraseña restablecida correctamente.');
      setTimeout(() => {
        window.location.href = '/login';
      }, 5000);
    } catch (err) {
      setMessage('Error al restablecer la contraseña.');
      toast.error('Error al restablecer la contraseña.');
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <h2>Restablecer Contraseña</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <FaLock className="icon" />
            <input
              type="password"
              placeholder="Nueva Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <FaLock className="icon" />
            <input
              type="password"
              placeholder="Confirmar Contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Restablecer Contraseña</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;

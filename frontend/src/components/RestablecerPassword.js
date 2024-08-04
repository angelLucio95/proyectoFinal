import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEnvelope } from 'react-icons/fa';
import './styles/RestablecerPassword.css';

const RestablecerPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5001/api/users/forgot-password', { email });
      setMessage(res.data.message);
      toast.success('Correo de restablecimiento enviado.');
      setTimeout(() => {
        window.location.href = '/login';
      }, 5000);
    } catch (err) {
      setMessage('Error al enviar el correo de restablecimiento');
      toast.error('Error al enviar el correo de restablecimiento.');
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <h2>Recuperar Contraseña</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <FaEnvelope className="icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit">Enviar Correo</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default RestablecerPassword;

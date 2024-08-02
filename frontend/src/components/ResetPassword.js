import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:5001/api/users/reset-password/${token}`, { password });
      console.log(res.data);
      setMessage('Contraseña restablecida correctamente.');
      toast.success('Contraseña restablecida correctamente.');
      setTimeout(() => {
        navigate('/login');
      }, 5000);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setMessage('Enlace inválido o expirado.');
        toast.error('Enlace inválido o expirado.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage('Error al restablecer la contraseña.');
        toast.error('Error al restablecer la contraseña.');
      }
    }
  };

  return (
    <div>
      <h1>Restablecer Contraseña</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Nueva Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Restablecer Contraseña</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;

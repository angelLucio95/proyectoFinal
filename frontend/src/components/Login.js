import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5001/api/users/login', { email, password });
      localStorage.setItem('token', res.data.token);
      toast.success('Inicio de sesión exitoso');
      navigate('/dashboard/weather');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al iniciar sesión';
      toast.error(errorMessage);
      console.error(errorMessage);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={onSubmit}>
        <h2>Iniciar Sesión</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Entrar</button>
        <button type="button" className="dropdown-btn" onClick={toggleDropdown}>
          Más opciones
        </button>
        {showDropdown && (
          <div className="dropdown-content">
            <Link to="/restablecer-password" className="dropdown-link">
              ¿Olvidaste tu contraseña?
            </Link>
            <Link to="/register" className="dropdown-link">
              ¿Eres nuevo? ¡Regístrate!
            </Link>
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;

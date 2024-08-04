import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaHome } from 'react-icons/fa';
import './styles/Register.css';
import { Carousel } from 'react-bootstrap';

// Importar imágenes locales
import imagen1 from './images/imagen1.jpg';
import imagen2 from './images/imagen2.jpeg';
import imagen3 from './images/imagen3.jpg';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('Other');
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    const newUser = { username, email, password, phone, gender, address };
    try {
      const res = await axios.post('http://localhost:5001/api/users/register', newUser);
      toast.success(res.data.message);
      navigate('/login');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al registrar';
      toast.error(errorMessage);
      console.error(errorMessage);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-carousel">
          <Carousel>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={imagen1}
                alt="First slide"
                style={{ height: '100%' }}
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={imagen2}
                alt="Second slide"
                style={{ height: '100%' }}
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={imagen3}
                alt="Third slide"
                style={{ height: '100%' }}
              />
            </Carousel.Item>
          </Carousel>
        </div>
        <div className="register-form">
          <h2>Signup</h2>
          <form onSubmit={onSubmit}>
            <div className="input-group">
              <FaUser className="icon" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="input-group">
              <FaEnvelope className="icon" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-group">
              <FaLock className="icon" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="input-group">
              <FaPhone className="icon" />
              <input
                type="text"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="input-group">
              <FaHome className="icon" />
              <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <button type="submit">Signup</button>
          </form>
          <div className="links">
            <a href="/login">Ya tienes cuenta? Inicia sesíon.</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

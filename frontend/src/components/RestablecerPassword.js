import React, { useState } from 'react';
import axios from 'axios';

const RestablecerPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5001/api/users/forgot-password', { email });
      setMessage(res.data.message);
      
    } catch (err) {
      setMessage('Error al enviar el correo de restablecimiento');
    }
  };

  return (
    <div>
      <h1>Recuperar Contraseña</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Enviar Correo</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RestablecerPassword;

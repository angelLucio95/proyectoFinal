const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendConfirmationEmail } = require('../services/mailer'); 
const router = express.Router();

// Validar la contraseña según las reglas establecidas
const validatePassword = (password) => {
  const minLength = 8;
  const hasNumber = /[0-9]/;
  const hasUpperCase = /[A-Z]/;
  const hasLowerCase = /[a-z]/;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
  const noConsecutiveChars = /(.)\1\1/;

  if (password.length < minLength) {
    return 'La contraseña debe tener al menos 8 caracteres.';
  }
  if (!hasNumber.test(password)) {
    return 'La contraseña debe contener al menos un número.';
  }
  if (!hasUpperCase.test(password)) {
    return 'La contraseña debe contener al menos una letra mayúscula.';
  }
  if (!hasLowerCase.test(password)) {
    return 'La contraseña debe contener al menos una letra minúscula.';
  }
  if (!hasSpecialChar.test(password)) {
    return 'La contraseña debe contener al menos un carácter especial.';
  }
  if (noConsecutiveChars.test(password)) {
    return 'La contraseña no debe contener caracteres consecutivos.';
  }
  return null;
};

router.get('/confirm/:token', async (req, res) => {
  const { token } = req.params;
  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);

      if (!user) {
          return res.status(404).send('Usuario no encontrado.');
      }

      user.isActive = true; // Actualiza el campo isActive
      await user.save(); // Guarda los cambios en la base de datos

      res.send('Cuenta activada correctamente.');
  } catch (error) {
      console.error('Error al activar la cuenta:', error);
      res.status(400).send('Enlace inválido o expirado.');
  }
});

// Ruta de registro
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  const passwordValidationError = validatePassword(password);
  if (passwordValidationError) {
    return res.status(400).json({ message: passwordValidationError });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ username, email, password: hashedPassword });
    await user.save();

    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    sendConfirmationEmail(email, token); 

    res.status(201).json({ message: 'Usuario registrado correctamente. Por favor, revise su correo electrónico para activar su cuenta.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Ruta de inicio de sesión
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(400).json({ message: 'Credenciales inválidas' });
      }

      if (!user.isActive) {
          return res.status(401).json({ message: 'La cuenta no ha sido activada. Por favor, revise su correo electrónico para activar su cuenta.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ message: 'Credenciales inválidas' });
      }

      const payload = { userId: user.id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.json({ token });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error del servidor' });
  }
});

// Ruta para obtener todos los usuarios (Para propósitos de prueba o administración)
router.get('/all', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
      const user = await User.findById(req.params.id);

      if (!user) {
          return res.status(404).json({ message: "Usuario no encontrado" });
      }

      await user.deleteOne();
      res.json({ message: "Usuario eliminado correctamente" });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error del servidor" });
  }
});

module.exports = router;

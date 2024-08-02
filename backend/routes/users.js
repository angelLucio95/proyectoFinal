const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendConfirmationEmail, sendResetPasswordEmail } = require('../services/mailer'); 
const router = express.Router();

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
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).send('Usuario no encontrado');
    }

    user.isActive = true; 
    await user.save();

    res.send('Cuenta activada con éxito');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al activar la cuenta');
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

    // Determinar el rol del usuario
    const isFirstUser = (await User.countDocuments({})) === 0;
    const role = isFirstUser ? 'Master' : 'Invitado';

    user = new User({ username, email, password: hashedPassword, role });
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

// Ruta para solicitar el restablecimiento de contraseña
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    sendResetPasswordEmail(email, token);

    res.json({ message: 'Correo de restablecimiento enviado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Ruta para restablecer la contraseña
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).send('Usuario no encontrado.');
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.send('Contraseña restablecida correctamente.');
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    res.status(400).send('Enlace inválido o expirado.');
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

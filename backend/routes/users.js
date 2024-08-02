const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendConfirmationEmail, sendResetPasswordEmail } = require('../services/mailer');
const auth = require('../middleware/auth');
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

// Middleware para verificar el rol de Master
const isMaster = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'Master') {
      return res.status(403).json({ message: 'Access denied' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
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

    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al activar la cuenta');
  }
});

router.post('/register', async (req, res) => {
  const { username, email, password, phone, gender, address } = req.body;

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

    const isFirstUser = (await User.countDocuments({})) === 0;
    const role = isFirstUser ? 'Master' : 'Invitado';
    
    console.log(`Assigning role: ${role}`); 

    user = new User({ username, email, password: hashedPassword, role, phone, gender, address });
    await user.save();

    const payload = { userId: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    sendConfirmationEmail(email, token);

    res.status(201).json({ message: 'Usuario registrado correctamente. Por favor, revise su correo electrónico para activar su cuenta.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

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

    const payload = { userId: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

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

router.get('/all', [auth, isMaster], async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
});

router.get('/:id', [auth, isMaster], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener el usuario' });
  }
});

router.put('/:id', [auth, isMaster], async (req, res) => {
  const { username, email, phone, gender, address, isActive } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.username = username || user.username;

    if (email && email !== user.email) {
      user.email = email;
      user.isActive = false;
      const payload = { userId: user.id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
      sendConfirmationEmail(email, token);
    }

    user.phone = phone || user.phone;
    user.gender = gender || user.gender;
    user.address = address || user.address;
    user.isActive = isActive !== undefined ? isActive : user.isActive;

    await user.save();
    res.json({ message: 'Usuario actualizado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
});

router.delete('/:id', [auth, isMaster], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await user.deleteOne();
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

router.put('/:id/role', [auth, isMaster], async (req, res) => {
  const { role } = req.body;
  if (!['Master', 'Invitado'].includes(role)) {
    return res.status(400).json({ message: 'Rol inválido' });
  }
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    user.role = role;
    await user.save();
    res.json({ message: 'Rol asignado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al asignar el rol' });
  }
});

module.exports = router;

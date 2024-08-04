const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/role');
const { sendConfirmationEmail, sendResetPasswordEmail } = require('../services/mailer'); 
const auth = require('../middleware/auth');
const checkPermission = require('../middleware/checkPermission');
const router = express.Router();

const validatePassword = (password) => {
  const minLength = 8;
  const hasNumber = /[0-9]/;
  const hasUpperCase = /[A-Z]/;
  const hasLowerCase = /[a-z]/;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
  const noConsecutiveChars = /(.)\1\1/;
  const noSequentialChars = /(012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i;

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
  if (noSequentialChars.test(password)) {
    return 'La contraseña no debe contener secuencias de números o letras consecutivas.';
  }
  return null;
};

const validateUserRole = async (roleId) => {
  const role = await Role.findById(roleId);
  return role ? true : false;
};

const createToken = (user) => {
  const payload = {
    userId: user._id,
    username: user.username,
    role: user.role.name,
    permissions: user.role.permissions
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Asignar rol a usuario
router.put('/:id/role', [auth, checkPermission('updateUsers')], async (req, res) => {
  const { roleId } = req.body;

  if (!validateUserRole(roleId)) {
    return res.status(400).json({ message: 'Rol inválido' });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.role = roleId;
    await user.save();
    res.json({ message: 'Rol asignado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al asignar el rol' });
  }
});

// Confirmar usuario
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

    res.redirect(`${process.env.BASE_URL_FRONT}/login`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Enlace inválido o expirado');
  }
});

// Registro de usuarios
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

    const userCount = await User.countDocuments({});
    let role;

    if (userCount === 0) {
      // Crear y asignar el rol Master al primer usuario
      role = new Role({
        name: 'Master',
        permissions: ['readUsers', 'createUsers', 'updateUsers', 'deleteUsers', 'readRoles', 'createRoles', 'updateRoles', 'deleteRoles', 'readHouses', 'createHouses', 'updateHouses', 'deleteHouses']
      });
      await role.save();
    } else {
      // Buscar o crear el rol Invitado
      role = await Role.findOne({ name: 'Invitado' });
      if (!role) {
        role = new Role({
          name: 'Invitado',
          permissions: ['readHouses'] // Ajusta los permisos según sea necesario
        });
        await role.save();
      }
    }

    user = new User({ username, email, password: hashedPassword, role: role._id, phone, gender, address });
    await user.save();

    const token = createToken(user);

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
    const user = await User.findOne({ email }).populate('role');
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

    const token = createToken(user);

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Solicitar restablecimiento de contraseña
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

// Restablecer contraseña
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

// Obtener todos los usuarios
router.get('/all', [auth, checkPermission('readUsers')], async (req, res) => {
  try {
    const users = await User.find({}).populate('role');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
});

// Obtener un usuario por ID
router.get('/:id', [auth, checkPermission('readUsers')], async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('role');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener el usuario' });
  }
});

// Actualizar un usuario
router.put('/:id', [auth, checkPermission('updateUsers')], async (req, res) => {
  const { username, email, phone, gender, address, isActive } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.username = username || user.username;

    // Si el correo ha cambiado, enviar confirmación de correo y desactivar el usuario
    if (email && email !== user.email) {
      user.email = email;
      user.isActive = false; // Desactivar hasta que el nuevo correo sea confirmado
      const payload = { userId: user.id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
      sendConfirmationEmail(email, token);
    }

    if (phone) user.phone = phone;
    if (gender) user.gender = gender;
    if (address) user.address = address;
    // Remover la posibilidad de actualizar isActive manualmente
    // if (typeof isActive !== 'undefined') user.isActive = isActive;

    await user.save();
    res.json({ message: 'Usuario actualizado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
});

// Eliminar un usuario
router.delete('/:id', [auth, checkPermission('deleteUsers')], async (req, res) => {
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

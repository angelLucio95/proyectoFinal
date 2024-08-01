const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const auth = require('../middleware/auth');

// routes/users.js

const validatePassword = (password) => {
  const minLength = 8;
  const hasNumber = /[0-9]/;
  const hasUpperCase = /[A-Z]/;
  const hasLowerCase = /[a-z]/;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
  const noConsecutiveChars = /(.)\1\1/;

  if (password.length < minLength) {
    return 'Password must be at least 8 characters long.';
  }
  if (!hasNumber.test(password)) {
    return 'Password must contain at least one number.';
  }
  if (!hasUpperCase.test(password)) {
    return 'Password must contain at least one uppercase letter.';
  }
  if (!hasLowerCase.test(password)) {
    return 'Password must contain at least one lowercase letter.';
  }
  if (!hasSpecialChar.test(password)) {
    return 'Password must contain at least one special character.';
  }
  if (noConsecutiveChars.test(password)) {
    return 'Password must not contain consecutive characters.';
  }
  if (/123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/.test(password.toLowerCase())) {
    return 'Password must not contain consecutive letters or numbers in sequence.';
  }
  return null;
};

// Register route
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  const passwordValidationError = validatePassword(password);
  if (passwordValidationError) {
    return res.status(400).json({ msg: passwordValidationError });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({ username, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/all', async (req, res) => {
  try {
      const users = await User.find({}); // Obtiene todos los usuarios
      res.json(users);
  } catch (err) {
      res.status(500).json({ message: "Error al obtener los usuarios", error: err });
  }
});



router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get user info
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

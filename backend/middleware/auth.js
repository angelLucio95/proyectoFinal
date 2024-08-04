const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');

const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).populate('role');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    const role = await Role.findById(user.role);
    req.user = { ...decoded, email: user.email, permissions: role.permissions };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;

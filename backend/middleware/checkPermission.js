const User = require('../models/User');
const Role = require('../models/Role');

function checkPermission(permission) {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.userId).populate('role');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (user.role.permissions.includes(permission)) {
        next();
      } else {
        res.status(403).json({ message: 'Permission denied' });
      }
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  };
}

module.exports = checkPermission;
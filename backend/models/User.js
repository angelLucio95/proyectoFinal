const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Master', 'Invitado'], default: 'Invitado' },
  date: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: false },
  phone: { type: String, default: '' },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Other' },
  address: { type: String, default: '' }
});

module.exports = mongoose.model('User', UserSchema);

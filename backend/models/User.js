const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Master', 'Invitado'], default: 'Invitado' }, // Nuevo campo de rol
  date: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: false } // Campo para confirmar el correo electrónico
});

module.exports = mongoose.model('User', UserSchema);

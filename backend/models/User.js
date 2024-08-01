const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  date: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: false } // Campo nuevo para la activación de la cuenta
});

module.exports = mongoose.model('User', UserSchema);



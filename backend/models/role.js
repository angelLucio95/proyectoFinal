// models/Role.js
const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  permissions: { type: [String], required: true }
});

module.exports = mongoose.models.Role || mongoose.model('Role', RoleSchema);

// backend/models/House.js
const mongoose = require('mongoose');

const HouseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  imageUrl: { type: String, required: true },
  status: { type: String, enum: ['Libre', 'Vendida', 'Rentada'], default: 'Libre' } // Nuevo campo
});

module.exports = mongoose.model('House', HouseSchema);

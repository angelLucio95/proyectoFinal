const mongoose = require('mongoose');

const HouseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  imageUrl: { type: String },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('House', HouseSchema);

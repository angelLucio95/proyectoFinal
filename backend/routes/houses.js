// routes/houses.js
const express = require('express');
const axios = require('axios');
const House = require('../models/House');
const auth = require('../middleware/auth');
const checkPermission = require('../middleware/checkPermission');
const router = express.Router();

// Obtener una imagen de una casa desde Unsplash
const getHouseImage = async () => {
  const unsplashApiKey = process.env.UNSPLASH_API_KEY;
  try {
    const response = await axios.get('https://api.unsplash.com/photos/random', {
      params: { query: 'house', client_id: unsplashApiKey }
    });
    return response.data.urls.regular;
  } catch (error) {
    console.error('Error fetching image from Unsplash:', error);
    return null;
  }
};

// Obtener todas las casas
router.get('/', auth, async (req, res) => {
  try {
    const houses = await House.find({});
    res.json(houses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener las casas' });
  }
});

// Obtener una casa por ID
router.get('/:id', auth, async (req, res) => {
  try {
    const house = await House.findById(req.params.id);
    if (!house) {
      return res.status(404).json({ message: 'Casa no encontrada' });
    }
    res.json(house);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener la casa' });
  }
});

// Crear una nueva casa (solo para roles con permisos)
router.post('/', [auth, checkPermission('createHouses')], async (req, res) => {
  const { title, description, price, location } = req.body;
  try {
    const imageUrl = await getHouseImage();
    const house = new House({ title, description, price, location, imageUrl });
    await house.save();
    res.status(201).json({ message: 'Casa creada correctamente', house });
  } catch (err) {
    console.error('Error al crear la casa:', err);
    res.status(500).json({ message: 'Error al crear la casa' });
  }
});

// Actualizar una casa (solo para roles con permisos)
router.put('/:id', [auth, checkPermission('updateHouses')], async (req, res) => {
  const { title, description, price, location, imageUrl } = req.body;
  try {
    const house = await House.findById(req.params.id);
    if (!house) {
      return res.status(404).json({ message: 'Casa no encontrada' });
    }

    house.title = title || house.title;
    house.description = description || house.description;
    house.price = price || house.price;
    house.location = location || house.location;
    house.imageUrl = imageUrl || house.imageUrl;

    await house.save();
    res.json({ message: 'Casa actualizada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar la casa' });
  }
});

// Eliminar una casa (solo para roles con permisos)
router.delete('/:id', [auth, checkPermission('deleteHouses')], async (req, res) => {
  try {
    const house = await House.findById(req.params.id);
    if (!house) {
      return res.status(404).json({ message: 'Casa no encontrada' });
    }

    await house.deleteOne();
    res.json({ message: 'Casa eliminada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar la casa' });
  }
});

module.exports = router;

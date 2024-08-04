// backend/routes/weather.js
const express = require('express');
const axios = require('axios');
const router = express.Router();
const cities = require('./cities');

// Ruta para obtener el clima de 5 ciudades aleatorias
router.get('/random', async (req, res) => {
  const apiKey = process.env.WEATHER_API_KEY;

  // Seleccionar 5 ciudades aleatorias
  const randomCities = [];
  while (randomCities.length < 5) {
    const randomIndex = Math.floor(Math.random() * cities.length);
    if (!randomCities.includes(cities[randomIndex])) {
      randomCities.push(cities[randomIndex]);
    }
  }

  try {
    const weatherData = await Promise.all(randomCities.map(async (city) => {
      const response = await axios.get(`https://api.weatherapi.com/v1/current.json`, {
        params: { key: apiKey, q: city, aqi: 'no' }
      });
      return {
        city,
        data: response.data
      };
    }));

    res.json(weatherData);
  } catch (error) {
    console.error('Error al obtener los datos del clima:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Error al obtener los datos del clima' });
  }
});

// Ruta para obtener el clima por ciudad
router.get('/', async (req, res) => {
  const { city } = req.query;
  const apiKey = process.env.WEATHER_API_KEY;

  try {
    const response = await axios.get(`https://api.weatherapi.com/v1/current.json`, {
      params: { key: apiKey, q: city, aqi: 'no' }
    });

    res.json([{ city, data: response.data }]);
  } catch (error) {
    console.error('Error al obtener los datos del clima:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Error al obtener los datos del clima' });
  }
});

module.exports = router;

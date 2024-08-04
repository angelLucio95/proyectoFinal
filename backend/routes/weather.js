// routes/weather.js
const express = require('express');
const axios = require('axios');
const router = express.Router();
const cities = require('./cities'); // Importar las ciudades

router.get('/', async (req, res) => {
  const { city } = req.query;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  const getWeatherData = async (city) => {
    try {
      const response = await axios.get(`http://api.weatherstack.com/current`, {
        params: {
          access_key: apiKey,
          query: city
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching weather for ${city}:`, error);
      return null;
    }
  };

  if (city) {
    const weatherData = await getWeatherData(city);
    return res.json([weatherData]);
  }

  const randomCities = [];
  while (randomCities.length < 5) {
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    if (!randomCities.includes(randomCity)) {
      randomCities.push(randomCity);
    }
  }

  const weatherPromises = randomCities.map(getWeatherData);
  const weatherData = await Promise.all(weatherPromises);

  res.json(weatherData.filter(data => data !== null));
});

module.exports = router;

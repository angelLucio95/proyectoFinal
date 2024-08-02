const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/weather', async (req, res) => {
  const { city } = req.query;
  const apiKey = process.env.OPENWEATHER_API_KEY;
  
  if (!city) {
    return res.status(400).json({ message: 'Por favor, proporciona el nombre de una ciudad' });
  }

  try {
    const response = await axios.get(`http://api.weatherstack.com/current?access_key=${apiKey}&query=${city}`);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los datos meteorológicos' });
  }
});

module.exports = router;

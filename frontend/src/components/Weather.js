import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);

  const fetchWeather = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/weather`, { params: { city } });
      setWeatherData(response.data);
      toast.success('Datos meteorológicos obtenidos correctamente');
    } catch (error) {
      toast.error('Error al obtener los datos meteorológicos');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather();
  };

  return (
    <div>
      <h1>Consulta del Clima</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ingresa el nombre de la ciudad"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">Obtener Clima</button>
      </form>
      {weatherData && (
        <div>
          <h2>Clima en {weatherData.location.name}</h2>
          <p>Temperatura: {weatherData.current.temperature}°C</p>
          <p>Condición: {weatherData.current.weather_descriptions[0]}</p>
        </div>
      )}
    </div>
  );
};

export default Weather;

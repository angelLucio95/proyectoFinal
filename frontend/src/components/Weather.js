import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './styles/Weather.css'; 

const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async (searchCity) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/weather`, {
        params: { city: searchCity }
      });
      if (searchCity) {
        setWeatherData([response.data[0], ...weatherData]);
      } else {
        setWeatherData(response.data);
      }
      toast.success('Datos meteorológicos obtenidos correctamente');
    } catch (error) {
      toast.error('Error al obtener los datos meteorológicos');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather(city);
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
      <div className="weather-cards">
        {weatherData.map((weather, index) => (
          <div key={index} className="weather-card">
            <h2>{weather.location.name}</h2>
            <p>Temperatura: {Math.round(weather.current.temperature)}°C</p>
            <p>Condición: {weather.current.weather_descriptions[0]}</p>
            <img src={weather.current.weather_icons[0]} alt="Weather icon" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Weather;

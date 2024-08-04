import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './styles/Weather.css';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    fetchRandomWeather();
  }, []);

  const fetchRandomWeather = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/weather/random');
      setWeatherData(response.data);
      toast.success('Datos meteorológicos obtenidos correctamente');
    } catch (error) {
      toast.error('Error al obtener los datos meteorológicos');
    }
  };

  const fetchWeather = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/weather', {
        params: { city },
      });
      setWeatherData(prevData => [...prevData, response.data[0]]);
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
      <div className="weather-cards">
        {weatherData.map((weather, index) => (
          <div key={index} className="weather-card">
            <h2>{weather.data.location.name}</h2>
            <p>Región: {weather.data.location.region}</p>
            <p>País: {weather.data.location.country}</p>
            <p>Temperatura: {weather.data.current.temp_c}°C</p>
            <p>Condición: {weather.data.current.condition.text}</p>
            <img src={weather.data.current.condition.icon} alt="weather icon" />
            <p>Viento: {weather.data.current.wind_kph} kph</p>
            <p>Humedad: {weather.data.current.humidity}%</p>
            <p>Sensación térmica: {weather.data.current.feelslike_c}°C</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Weather;

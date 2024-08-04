import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './styles/HouseCatalog.css';

const HouseCatalog = () => {
  const [houses, setHouses] = useState([]);

  useEffect(() => {
    fetchHouses();
  }, []);

  const fetchHouses = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5001/api/houses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const availableHouses = res.data.filter(house => house.status === 'Libre');
      setHouses(availableHouses);
    } catch (err) {
      toast.error('Error al obtener las casas');
    }
  };

  const handleScheduleVisit = async (houseId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(
        `http://localhost:5001/api/houses/${houseId}/schedule-visit`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(res.data.message);
    } catch (err) {
      toast.error('Error al agendar la visita');
    }
  };

  return (
    <div className="house-catalog-container">
      <h1>Catálogo de Casas</h1>
      <div className="house-catalog">
        {houses.map((house) => (
          <div className="house-card" key={house._id}>
            <img src={house.imageUrl} alt={house.title} className="house-image" />
            <h3>{house.title}</h3>
            <p>{house.description}</p>
            <p>Precio: ${house.price}</p>
            <p>Ubicación: {house.location}</p>
            <button onClick={() => handleScheduleVisit(house._id)}>Agendar Visita</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HouseCatalog;

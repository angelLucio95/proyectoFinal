// frontend/src/components/HouseCatalog.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './styles/HouseCatalog.css';

const HouseCatalog = () => {
  const [houses, setHouses] = useState([]);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [visitDate, setVisitDate] = useState('');

  useEffect(() => {
    fetchHouses();
  }, []);

  const handleEdit = (house) => {
    setSelectedHouse(house);
  };

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
        { visitDate },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(res.data.message);
      setSelectedHouse(null);
    } catch (err) {
      toast.error('Error al agendar la visita');
    }
  };

  return (
    <div>
      <h1>Catálogo de Casas</h1>
      <div className="houses-grid">
        {houses.map((house) => (
          <div className="house-card" key={house._id}>
            <img src={house.imageUrl} alt={house.title} className="house-image" />
            <h3>{house.title}</h3>
            <p>{house.description}</p>
            <p>Precio: ${house.price}</p>
            <p>Ubicación: {house.location}</p>
            <button onClick={() => setSelectedHouse(house)}>Agendar Visita</button>
          </div>
        ))}
      </div>

      {selectedHouse && (
        <div className="modal">
          <h2>Agendar Visita</h2>
          <p>{selectedHouse.title}</p>
          <input
            type="datetime-local"
            value={visitDate}
            onChange={(e) => setVisitDate(e.target.value)}
          />
          <button onClick={() => handleScheduleVisit(selectedHouse._id)}>Confirmar Visita</button>
          <button onClick={() => setSelectedHouse(null)}>Cancelar</button>
        </div>
      )}
    </div>
  );
};

export default HouseCatalog;

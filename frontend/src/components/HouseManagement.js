import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './styles/HouseManagement.css'; // Ajusta la ruta según tu estructura de carpetas

const HouseManagement = () => {
  const [houses, setHouses] = useState([]);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [newHouse, setNewHouse] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
  });

  useEffect(() => {
    fetchHouses();
  }, []);

  const fetchHouses = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5001/api/houses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHouses(res.data);
    } catch (err) {
      toast.error('Error al obtener las casas');
    }
  };

  const fetchImageUrl = async (query) => {
    try {
      const res = await axios.get('https://api.unsplash.com/search/photos', {
        params: { query, per_page: 1 },
        headers: { Authorization: `Client-ID ${process.env.REACT_APP_UNSPLASH_API_KEY}` },
      });
      const imageUrl = res.data.results[0]?.urls?.regular || '';
      return imageUrl;
    } catch (err) {
      toast.error('Error al obtener la imagen de Unsplash');
      return '';
    }
  };

  const handleEdit = (house) => {
    setSelectedHouse(house);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5001/api/houses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Casa eliminada correctamente');
      fetchHouses();
    } catch (err) {
      toast.error('Error al eliminar la casa');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const imageUrl = await fetchImageUrl(selectedHouse.location);
    try {
      await axios.put(
        `http://localhost:5001/api/houses/${selectedHouse._id}`,
        { ...selectedHouse, imageUrl },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Casa actualizada correctamente');
      setSelectedHouse(null);
      fetchHouses();
    } catch (err) {
      toast.error('Error al actualizar la casa');
    }
  };

  const handleNewHouseSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const imageUrl = await fetchImageUrl(newHouse.location);
    try {
      await axios.post(
        'http://localhost:5001/api/houses',
        { ...newHouse, imageUrl },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Casa registrada correctamente');
      setNewHouse({
        title: '',
        description: '',
        price: '',
        location: '',
      });
      fetchHouses();
    } catch (err) {
      toast.error('Error al registrar la casa');
    }
  };

  return (
    <div>
      <h1>Gestión de Casas</h1>
      {selectedHouse && (
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            placeholder="Título"
            value={selectedHouse.title}
            onChange={(e) => setSelectedHouse({ ...selectedHouse, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Descripción"
            value={selectedHouse.description}
            onChange={(e) => setSelectedHouse({ ...selectedHouse, description: e.target.value })}
          />
          <input
            type="number"
            placeholder="Precio"
            value={selectedHouse.price}
            onChange={(e) => setSelectedHouse({ ...selectedHouse, price: e.target.value })}
          />
          <input
            type="text"
            placeholder="Ubicación"
            value={selectedHouse.location}
            onChange={(e) => setSelectedHouse({ ...selectedHouse, location: e.target.value })}
          />
          <button type="submit">Actualizar Casa</button>
        </form>
      )}
      <h2>Registrar Nueva Casa</h2>
      <form onSubmit={handleNewHouseSubmit} className="form">
        <input
          type="text"
          placeholder="Título"
          value={newHouse.title}
          onChange={(e) => setNewHouse({ ...newHouse, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Descripción"
          value={newHouse.description}
          onChange={(e) => setNewHouse({ ...newHouse, description: e.target.value })}
        />
        <input
          type="number"
          placeholder="Precio"
          value={newHouse.price}
          onChange={(e) => setNewHouse({ ...newHouse, price: e.target.value })}
        />
        <input
          type="text"
          placeholder="Ubicación"
          value={newHouse.location}
          onChange={(e) => setNewHouse({ ...newHouse, location: e.target.value })}
        />
        <button type="submit">Registrar Casa</button>
      </form>
      <h2>Lista de Casas</h2>
      <table className="house-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Ubicación</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {houses.map((house) => (
            <tr key={house._id}>
              <td>{house.title}</td>
              <td>{house.description}</td>
              <td>{house.price}</td>
              <td>{house.location}</td>
              <td>
                {house.imageUrl && <img src={house.imageUrl} alt={house.title} className="house-image" />}
              </td>
              <td>
                <button onClick={() => handleEdit(house)}>Editar</button>
                <button onClick={() => handleDelete(house._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HouseManagement;

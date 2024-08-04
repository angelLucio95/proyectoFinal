import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Modal, Button, Form } from 'react-bootstrap';
import './styles/HouseManagement.css';

const HouseManagement = () => {
  const [houses, setHouses] = useState([]);
  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentHouse, setCurrentHouse] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    status: 'Libre'
  });
  const [newHouse, setNewHouse] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    status: 'Libre'
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

  const handleShow = () => {
    setEditMode(false);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setCurrentHouse({
      title: '',
      description: '',
      price: '',
      location: '',
      status: 'Libre'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editMode) {
      setCurrentHouse({ ...currentHouse, [name]: value });
    } else {
      setNewHouse({ ...newHouse, [name]: value });
    }
  };

  const handleAddHouse = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5001/api/houses', newHouse, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Casa agregada correctamente');
      setNewHouse({
        title: '',
        description: '',
        price: '',
        location: '',
        status: 'Libre'
      });
      handleClose();
      fetchHouses();
    } catch (err) {
      toast.error('Error al agregar la casa');
    }
  };

  const handleEditHouse = (house) => {
    setCurrentHouse(house);
    setEditMode(true);
    setShow(true);
  };

  const handleUpdateHouse = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5001/api/houses/${currentHouse._id}`, currentHouse, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Casa actualizada correctamente');
      handleClose();
      fetchHouses();
    } catch (err) {
      toast.error('Error al actualizar la casa');
    }
  };

  const handleDeleteHouse = async (houseId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5001/api/houses/${houseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Casa eliminada correctamente');
      fetchHouses();
    } catch (err) {
      toast.error('Error al eliminar la casa');
    }
  };

  return (
    <div className="house-management-container">
      <h1>Gestión de Casas</h1>
      <Button variant="primary" onClick={handleShow}>
        Agregar Casa
      </Button>
      <div className="house-table-container">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Título</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Ubicación</th>
              <th>Imagen</th>
              <th>Status</th>
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
                <td><img src={house.imageUrl} alt={house.title} className="house-image" /></td>
                <td>
                  <span className={`chip ${house.status.toLowerCase()}`}>
                    {house.status}
                  </span>
                </td>
                <td>
                  <Button
                    variant="warning"
                    onClick={() => handleEditHouse(house)}
                    className="m-1"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteHouse(house._id)}
                    className="m-1"
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Editar Casa' : 'Agregar Casa'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={editMode ? currentHouse.title : newHouse.title}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={editMode ? currentHouse.description : newHouse.description}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={editMode ? currentHouse.price : newHouse.price}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Ubicación</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={editMode ? currentHouse.location : newHouse.location}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={editMode ? currentHouse.status : newHouse.status}
                onChange={handleInputChange}
              >
                <option value="Libre">Libre</option>
                <option value="Rentada">Rentada</option>
                <option value="Vendida">Vendida</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={editMode ? handleUpdateHouse : handleAddHouse}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HouseManagement;

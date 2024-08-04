import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUserPlus, FaEdit, FaTrash } from 'react-icons/fa';
import './styles/UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Estado para el sidebar
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    gender: '',
    address: '',
    isActive: '',
    role: '',
  });

  useEffect(() => {
    fetchUsers();
    handleSidebarToggle(); // Escuchar el estado del sidebar
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5001/api/users/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      toast.error('Error al obtener los usuarios');
    }
  };

  const handleSidebarToggle = () => {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', () => {
        setIsSidebarOpen(!isSidebarOpen);
      });
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      address: user.address,
      isActive: user.isActive,
      role: user.role.name,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5001/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Usuario eliminado correctamente');
      fetchUsers();
    } catch (err) {
      toast.error('Error al eliminar el usuario');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const url = selectedUser
      ? `http://localhost:5001/api/users/${selectedUser._id}`
      : 'http://localhost:5001/api/users/register';
    const method = selectedUser ? 'put' : 'post';

    try {
      await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(`Usuario ${selectedUser ? 'actualizado' : 'registrado'} correctamente`);
      setShowForm(false);
      setFormData({
        username: '',
        email: '',
        phone: '',
        gender: '',
        address: '',
        isActive: '',
        role: '',
      });
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      toast.error(`Error al ${selectedUser ? 'actualizar' : 'registrar'} el usuario`);
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setFormData({
      username: '',
      email: '',
      phone: '',
      gender: '',
      address: '',
      isActive: '',
      role: '',
    });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedUser(null);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className={`user-management-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <h1>Gestión de Usuarios</h1>
      <button className="add-user-btn" onClick={handleAddUser}>
        <FaUserPlus /> Agregar Usuario
      </button>
      <table className="user-table">
        <thead>
          <tr>
            <th>Nombre de Usuario</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Género</th>
            <th>Dirección</th>
            <th>Estado</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.gender}</td>
              <td>{user.address}</td>
              <td>
                <span className={`status-chip ${user.isActive ? 'active' : 'inactive'}`}>
                  {user.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td>{user.role.name}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(user)}>
                  <FaEdit />
                </button>
                <button className="delete-btn" onClick={() => handleDelete(user._id)}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showForm && (
        <div className="user-form">
          <h2>{selectedUser ? 'Editar Usuario' : 'Agregar Usuario'}</h2>
          <form onSubmit={handleSubmit}>
            <label>Nombre de Usuario</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <label>Teléfono</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
            <label>Género</label>
            <select name="gender" value={formData.gender} onChange={handleInputChange} required>
              <option value="">Seleccione</option>
              <option value="Male">Masculino</option>
              <option value="Female">Femenino</option>
              <option value="Other">Otro</option>
            </select>
            <label>Dirección</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
            {!selectedUser && (
              <>
                <label>Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </>
            )}
            {selectedUser && (
              <>
                <label>Estado</label>
                <input
                  type="text"
                  name="isActive"
                  value={formData.isActive ? 'Activo' : 'Inactivo'}
                  disabled
                />
              </>
            )}
            <button type="submit">{selectedUser ? 'Actualizar' : 'Registrar'}</button>
            <button type="button" onClick={handleCloseForm}>
              Cancelar
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

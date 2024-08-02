import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    gender: 'Other',
    address: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/users/all');
      setUsers(res.data);
    } catch (err) {
      toast.error('Error al obtener los usuarios');
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/users/${id}`);
      toast.success('Usuario eliminado correctamente');
      fetchUsers();
    } catch (err) {
      toast.error('Error al eliminar el usuario');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5001/api/users/${selectedUser._id}`, {
        username: selectedUser.username,
        email: selectedUser.email,
        phone: selectedUser.phone,
        gender: selectedUser.gender,
        address: selectedUser.address,
        isActive: selectedUser.isActive
      });
      toast.success('Usuario actualizado correctamente');
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      toast.error('Error al actualizar el usuario');
    }
  };

  const handleNewUserSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/users/register', newUser);
      toast.success('Usuario registrado correctamente');
      setNewUser({
        username: '',
        email: '',
        password: '',
        phone: '',
        gender: 'Other',
        address: ''
      });
      fetchUsers();
    } catch (err) {
      toast.error('Error al registrar el usuario');
    }
  };

  return (
    <div>
      <h1>Gestión de Usuarios</h1>
      {selectedUser && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={selectedUser.username}
            onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={selectedUser.email}
            onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="Phone"
            value={selectedUser.phone}
            onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })}
          />
          <select
            value={selectedUser.gender}
            onChange={(e) => setSelectedUser({ ...selectedUser, gender: e.target.value })}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="text"
            placeholder="Address"
            value={selectedUser.address}
            onChange={(e) => setSelectedUser({ ...selectedUser, address: e.target.value })}
          />
          <label>
            <input
              type="checkbox"
              checked={selectedUser.isActive}
              onChange={(e) => setSelectedUser({ ...selectedUser, isActive: e.target.checked })}
            />
            Active
          </label>
          <p>Rol: {selectedUser.role}</p>
          <button type="submit">Actualizar Usuario</button>
        </form>
      )}
      <h2>Registrar Nuevo Usuario</h2>
      <form onSubmit={handleNewUserSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        />
        <input
          type="text"
          placeholder="Phone"
          value={newUser.phone}
          onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
        />
        <select
          value={newUser.gender}
          onChange={(e) => setNewUser({ ...newUser, gender: e.target.value })}
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="text"
          placeholder="Address"
          value={newUser.address}
          onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
        />
        <button type="submit">Registrar Usuario</button>
      </form>
      <h2>Lista de Usuarios</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Gender</th>
            <th>Address</th>
            <th>Role</th>
            <th>Active</th>
            <th>Actions</th>
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
              <td>{user.role}</td>
              <td>{user.isActive ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => handleEdit(user)}>Editar</button>
                <button onClick={() => handleDelete(user._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;

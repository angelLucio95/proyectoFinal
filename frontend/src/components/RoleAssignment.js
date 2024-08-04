import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './styles/RoleAssignment.css';

const RoleAssignment = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    handleSidebarToggle();
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

  const fetchRoles = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5001/api/roles', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoles(res.data);
    } catch (err) {
      toast.error('Error al obtener los roles');
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

  const handleRoleChange = async (userId, roleId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `http://localhost:5001/api/users/${userId}/role`,
        { roleId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Rol actualizado correctamente');
      fetchUsers();
    } catch (err) {
      toast.error('Error al actualizar el rol');
    }
  };

  return (
    <div className={`role-assignment-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <h1>Asignación de Roles</h1>
      <table className="user-table">
        <thead>
          <tr>
            <th>Nombre de Usuario</th>
            <th>Email</th>
            <th>Rol Actual</th>
            <th>Asignar Nuevo Rol</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <span className="chip chip-role">{user.role.name}</span>
              </td>
              <td>
                <select
                  value={user.role._id}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                >
                  {roles.map((role) => (
                    <option key={role._id} value={role._id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoleAssignment;

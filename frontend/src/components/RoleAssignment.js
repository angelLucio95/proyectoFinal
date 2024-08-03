import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const RoleAssignment = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5001/api/users/all', {
        headers: { 'Authorization': `Bearer ${token}` }
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
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setRoles(res.data);
    } catch (err) {
      toast.error('Error al obtener los roles');
    }
  };

  const handleRoleChange = async (userId, roleId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5001/api/users/${userId}/role`, {
        roleId
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      toast.success('Rol asignado correctamente');
      fetchUsers();
    } catch (err) {
      toast.error('Error al asignar el rol');
    }
  };

  return (
    <div>
      <h1>Asignación de Roles</h1>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Rol Actual</th>
            <th>Nuevo Rol</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role.name}</td>
              <td>
                <select
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  defaultValue={user.role._id}
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

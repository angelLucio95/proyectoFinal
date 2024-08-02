import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [newRole, setNewRole] = useState({ name: '', permissions: [] });
  const [availablePermissions, setAvailablePermissions] = useState([
    'readUsers', 'createUsers', 'updateUsers', 'deleteUsers', 
    'readRoles', 'createRoles', 'updateRoles', 'deleteRoles'
  ]);

  console.log(setAvailablePermissions);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/roles');
      setRoles(res.data);
    } catch (err) {
      toast.error('Error al obtener los roles');
    }
  };

  const handleEdit = (role) => {
    setSelectedRole(role);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/roles/${id}`);
      toast.success('Rol eliminado correctamente');
      fetchRoles();
    } catch (err) {
      toast.error('Error al eliminar el rol');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5001/api/roles/${selectedRole._id}`, selectedRole);
      toast.success('Rol actualizado correctamente');
      setSelectedRole(null);
      fetchRoles();
    } catch (err) {
      toast.error('Error al actualizar el rol');
    }
  };

  const handleNewRoleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/roles', newRole);
      toast.success('Rol registrado correctamente');
      setNewRole({ name: '', permissions: [] });
      fetchRoles();
    } catch (err) {
      toast.error('Error al registrar el rol');
    }
  };

  const handlePermissionChange = (role, permission) => {
    if (role.permissions.includes(permission)) {
      role.permissions = role.permissions.filter(p => p !== permission);
    } else {
      role.permissions.push(permission);
    }
    setSelectedRole({ ...role });
  };

  const handleNewRolePermissionChange = (permission) => {
    if (newRole.permissions.includes(permission)) {
      newRole.permissions = newRole.permissions.filter(p => p !== permission);
    } else {
      newRole.permissions.push(permission);
    }
    setNewRole({ ...newRole });
  };

  return (
    <div>
      <h1>Gestión de Roles</h1>
      {selectedRole && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Role Name"
            value={selectedRole.name}
            onChange={(e) => setSelectedRole({ ...selectedRole, name: e.target.value })}
          />
          <div>
            <h3>Permisos</h3>
            {availablePermissions.map((permission) => (
              <label key={permission}>
                <input
                  type="checkbox"
                  checked={selectedRole.permissions.includes(permission)}
                  onChange={() => handlePermissionChange(selectedRole, permission)}
                />
                {permission}
              </label>
            ))}
          </div>
          <button type="submit">Actualizar Rol</button>
        </form>
      )}
      <h2>Registrar Nuevo Rol</h2>
      <form onSubmit={handleNewRoleSubmit}>
        <input
          type="text"
          placeholder="Role Name"
          value={newRole.name}
          onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
        />
        <div>
          <h3>Permisos</h3>
          {availablePermissions.map((permission) => (
            <label key={permission}>
              <input
                type="checkbox"
                checked={newRole.permissions.includes(permission)}
                onChange={() => handleNewRolePermissionChange(permission)}
              />
              {permission}
            </label>
          ))}
        </div>
        <button type="submit">Registrar Rol</button>
      </form>
      <h2>Lista de Roles</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre del Rol</th>
            <th>Permisos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role._id}>
              <td>{role.name}</td>
              <td>{role.permissions.join(', ')}</td>
              <td>
                <button onClick={() => handleEdit(role)}>Editar</button>
                <button onClick={() => handleDelete(role._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoleManagement;

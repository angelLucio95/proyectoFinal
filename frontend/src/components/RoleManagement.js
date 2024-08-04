import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaUser, FaShieldAlt, FaHome } from 'react-icons/fa';
import './styles/RoleManagement.css';

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    permissions: []
  });

  const availablePermissions = {
    users: ['readUsers', 'createUsers', 'updateUsers', 'deleteUsers'],
    roles: ['readRoles', 'createRoles', 'updateRoles', 'deleteRoles'],
    houses: ['readHouses', 'createHouses', 'updateHouses', 'deleteHouses']
  };

  useEffect(() => {
    fetchRoles();
    handleSidebarToggle();
  }, []);

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

  const handleEdit = (role) => {
    setSelectedRole(role);
    setFormData({
      name: role.name,
      permissions: role.permissions
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5001/api/roles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Rol eliminado correctamente');
      fetchRoles();
    } catch (err) {
      toast.error('No puede eliminar este rol ya que 1 o mas usuarios tienen este rol');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('El nombre del rol no puede estar vacío');
      return;
    }
    const token = localStorage.getItem('token');
    const url = selectedRole
      ? `http://localhost:5001/api/roles/${selectedRole._id}`
      : 'http://localhost:5001/api/roles';
    const method = selectedRole ? 'put' : 'post';

    try {
      await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(`Rol ${selectedRole ? 'actualizado' : 'registrado'} correctamente`);
      setShowForm(false);
      setFormData({ name: '', permissions: [] });
      setSelectedRole(null);
      fetchRoles();
    } catch (err) {
      toast.error(`Error al ${selectedRole ? 'actualizar' : 'registrar'} el rol`);
    }
  };

  const handleAddRole = () => {
    setSelectedRole(null);
    setFormData({ name: '', permissions: [] });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedRole(null);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePermissionChange = (permission) => {
    setFormData((prevData) => {
      const permissions = prevData.permissions.includes(permission)
        ? prevData.permissions.filter((perm) => perm !== permission)
        : [...prevData.permissions, permission];
      return { ...prevData, permissions };
    });
  };

  const renderPermissions = (permissions, label, icon) => (
    <>
      <h3>{icon} {label}</h3>
      <hr />
      {permissions.map((permission) => (
        <div key={permission}>
          <input
            type="checkbox"
            checked={formData.permissions.includes(permission)}
            onChange={() => handlePermissionChange(permission)}
          />
          <span className={`chip ${getChipColor(permission)}`}>{permission}</span>
        </div>
      ))}
    </>
  );

  const getChipColor = (permission) => {
    if (permission.startsWith('read')) return 'chip-read';
    if (permission.startsWith('create')) return 'chip-create';
    if (permission.startsWith('update')) return 'chip-update';
    if (permission.startsWith('delete')) return 'chip-delete';
    return '';
  };

  return (
    <div className={`role-management-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <h1>Gestión de Roles</h1>
      <button className="add-role-btn" onClick={handleAddRole}>
        <FaPlus /> Agregar Rol
      </button>
      <table className="role-table">
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
              <td>
                {role.permissions.map((permission) => (
                  <span key={permission} className={`chip ${getChipColor(permission)}`}>{permission}</span>
                ))}
              </td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(role)}>
                  <FaEdit />
                </button>
                <button className="delete-btn" onClick={() => handleDelete(role._id)}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showForm && (
        <div className="role-form">
          <h2>{selectedRole ? 'Editar Rol' : 'Agregar Rol'}</h2>
          <form onSubmit={handleSubmit}>
            <label>Nombre del Rol</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
            <div className="permissions">
              {renderPermissions(availablePermissions.users, 'Usuarios', <FaUser />)}
              {renderPermissions(availablePermissions.roles, 'Roles', <FaShieldAlt />)}
              {renderPermissions(availablePermissions.houses, 'Casas', <FaHome />)}
            </div>
            <button type="submit">{selectedRole ? 'Actualizar' : 'Registrar'}</button>
            <button type="button" onClick={handleCloseForm}>
              Cancelar
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default RoleManagement;

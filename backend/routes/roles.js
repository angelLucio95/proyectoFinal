const express = require('express');
const Role = require('../models/Role');
const User = require('../models/User'); 
const auth = require('../middleware/auth');
const checkPermission = require('../middleware/checkPermission');
const router = express.Router();

// Obtener todos los roles
router.get('/', [auth, checkPermission('readRoles')], async (req, res) => {
  try {
    const roles = await Role.find({});
    res.json(roles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener los roles' });
  }
});

// Obtener un rol por ID
router.get('/:id', [auth, checkPermission('readRoles')], async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }
    res.json(role);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener el rol' });
  }
});

// Crear un nuevo rol
router.post('/', [auth, checkPermission('createRoles')], async (req, res) => {
  const { name, permissions } = req.body;
  try {
    const role = new Role({ name, permissions });
    await role.save();
    res.status(201).json({ message: 'Rol creado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear el rol' });
  }
});

// Actualizar un rol
router.put('/:id', [auth, checkPermission('updateRoles')], async (req, res) => {
  const { name, permissions } = req.body;
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }

    role.name = name || role.name;
    role.permissions = permissions || role.permissions;

    await role.save();
    res.json({ message: 'Rol actualizado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar el rol' });
  }
});

// Eliminar un rol
router.delete('/:id', [auth, checkPermission('deleteRoles')], async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }

    const usersWithRole = await User.find({ role: role._id });
    if (usersWithRole.length > 0) {
      return res.status(400).json({ message: 'No se puede eliminar el rol porque está asignado a uno o más usuarios' });
    }

    await role.deleteOne();
    res.json({ message: 'Rol eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar el rol' });
  }
});

module.exports = router;
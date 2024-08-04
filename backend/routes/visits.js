const express = require('express');
const House = require('../models/House');
const auth = require('../middleware/auth');
const checkPermission = require('../middleware/checkPermission');
const { sendVisitConfirmationEmail } = require('../services/mailer');
const router = express.Router();

// Obtener casas disponibles para agendar visitas
router.get('/', auth, async (req, res) => {
  try {
    const houses = await House.find({ status: 'Libre' });
    res.json(houses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener las casas disponibles' });
  }
});

// Agendar una visita
router.post('/schedule', auth, async (req, res) => {
  const { houseId, userEmail } = req.body;
  try {
    const house = await House.findById(houseId);
    if (!house || house.status !== 'Libre') {
      return res.status(404).json({ message: 'Casa no disponible para visitas' });
    }

    // Generar una fecha y hora aleatoria para la visita
    const visitDate = new Date();
    visitDate.setDate(visitDate.getDate() + Math.floor(Math.random() * 10) + 1);
    visitDate.setHours(Math.floor(Math.random() * 8) + 9);
    visitDate.setMinutes(0);

    // Enviar correo de confirmación
    await sendVisitConfirmationEmail(userEmail, house.title, visitDate);

    res.status(200).json({ message: 'Visita agendada correctamente', visitDate });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al agendar la visita' });
  }
});

module.exports = router;

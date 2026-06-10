const { Router } = require('express');
// Importamos el controlador único e instanciado que unificamos con la Arquitectura Limpia
const pronosticoController = require('../controllers/pronostico.controller');

const router = Router();

// ⚽ Endpoint para guardar o actualizar un pronóstico (Ya funcionando)
router.post('/', (req, res) => pronosticoController.create(req, res));

// 🏁 🎯 NUEVO ENDPOINT: Para finalizar el partido real, cerrar apuestas y calcular los puntos de los usuarios
router.post('/finalizar', (req, res) => pronosticoController.finalizarPartido(req, res));

module.exports = router;
const express = require('express');
const router = express.Router();
const caballeroController = require('../controllers/caballeroController');

// Rutas limpias, solo JSON
router.delete('/caballero/:nombre', caballeroController.eliminarPorNombre);
router.put('/caballero/:nombre', caballeroController.modificarPorNombre);
router.post('/caballero', caballeroController.crearCaballeroYBatalla);
router.get('/caballero/:nombre', caballeroController.consultarPorNombre);
router.get('/caballeros', caballeroController.listarTodos);

module.exports = router;

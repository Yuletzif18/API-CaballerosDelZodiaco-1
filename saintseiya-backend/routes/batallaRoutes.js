
const express = require('express');
const router = express.Router();
const batallaController = require('../controllers/batallaController');
router.post('/batallas', batallaController.crearBatalla);

router.get('/batallas/:nombre', batallaController.getBatallasPorCaballero);
router.get('/batallas', batallaController.listarTodas);

module.exports = router;
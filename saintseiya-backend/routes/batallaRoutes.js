
const express = require('express');
const router = express.Router();
const RateLimit = require('express-rate-limit');
const batallaController = require('../controllers/batallaController');

const crearBatallaLimiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many batallas created from this IP, please try again later.'
});

router.post('/batallas', crearBatallaLimiter, batallaController.crearBatalla);

router.get('/batallas/:nombre', batallaController.getBatallasPorCaballero);
router.get('/batallas', batallaController.listarTodas);

module.exports = router;
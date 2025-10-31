const express = require('express');
const RateLimit = require('express-rate-limit');
const router = express.Router();
const caballeroController = require('../controllers/caballeroController');
const multer = require('multer');
const path = require('path');


// Rate limiter: max 100 requests per 15 minutes per IP
const limiter = RateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, '../uploads'));
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + '-' + file.originalname);
	}
});
const upload = multer({ storage });

router.delete('/caballero/:nombre', caballeroController.eliminarPorNombre);
router.put('/caballero/:nombre', upload.single('imagen'), caballeroController.modificarPorNombre);
router.post('/caballero', upload.single('imagen'), caballeroController.crearCaballeroYBatalla);
router.get('/caballero/:nombre', limiter, caballeroController.consultarPorNombre);
router.get('/caballeros', caballeroController.listarTodos);

module.exports = router;

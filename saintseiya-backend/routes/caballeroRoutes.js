const express = require('express');
const router = express.Router();
const caballeroController = require('../controllers/caballeroController');
const multer = require('multer');
const path = require('path');

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
router.get('/caballero/:nombre', caballeroController.consultarPorNombre);
router.get('/caballeros', caballeroController.listarTodos);

module.exports = router;

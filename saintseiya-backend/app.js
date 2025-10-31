const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const caballeroRoutes = require('./routes/caballeroRoutes');
const batallaRoutes = require('./routes/batallaRoutes');

// Conexión y modelo para caballeros
const connCaballeros = mongoose.createConnection('mongodb+srv://yuletzif2209_db_user:Yule2209@caballerosdelzodiaco.2xuwe9y.mongodb.net/saintseiya_caballeros?retryWrites=true&w=majority');
const CaballeroSchema = require('./models/Caballero').schema;
connCaballeros.model('Caballero', CaballeroSchema, 'caballeros');

// Conexión y modelo para batallas
const connBatallas = mongoose.createConnection('mongodb+srv://yuletzif2209_db_user:Yule2209@caballerosdelzodiaco.2xuwe9y.mongodb.net/saintseiya_batallas?retryWrites=true&w=majority');
const BatallaSchema = require('./models/Batalla').schema;
connBatallas.model('Batalla', BatallaSchema, 'batallas');

// Servidor para caballeros
const appCaballeros = express();
appCaballeros.use(cors());
appCaballeros.use(express.json());
appCaballeros.use('/uploads', express.static(__dirname + '/uploads'));
appCaballeros.use((req, res, next) => {
	req.db = connCaballeros;
	next();
});
appCaballeros.use('/api', caballeroRoutes);
appCaballeros.listen(3001, () => {
	console.log('API Caballeros corriendo en puerto 3001');
	console.log('Puedes consultar: http://localhost:3001/api/caballeros');
	console.log('Puedes consultar por nombre: http://localhost:3001/api/caballero/Mu');
	console.log('Imágenes servidas en: http://localhost:3001/uploads/<nombre-archivo>');
});

// Servidor para batallas
const appBatallas = express();
appBatallas.use(cors());
appBatallas.use(express.json());
appBatallas.use((req, res, next) => {
	req.db = connBatallas;
	next();
});
appBatallas.use('/api', batallaRoutes);
appBatallas.listen(3002, () => {
	console.log('API Batallas corriendo en puerto 3002');
	console.log('Puedes consultar: http://localhost:3002/api/batallas');
	console.log('Puedes consultar por nombre: http://localhost:3002/api/batallas/Mu');
});

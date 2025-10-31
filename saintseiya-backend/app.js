
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const caballeroRoutes = require('./routes/caballeroRoutes');
const batallaRoutes = require('./routes/batallaRoutes');

// Conexión y modelo para caballeros
if (!process.env.MONGODB_URI_CABALLEROS) {
	throw new Error('La variable de entorno MONGODB_URI_CABALLEROS no está definida. Verifica tu archivo .env.');
}
const connCaballeros = mongoose.createConnection(process.env.MONGODB_URI_CABALLEROS);
const CaballeroSchema = require('./models/Caballero').schema;
connCaballeros.model('Caballero', CaballeroSchema, 'caballeros');

// Conexión y modelo para batallas
if (!process.env.MONGODB_URI_BATALLAS) {
	throw new Error('La variable de entorno MONGODB_URI_BATALLAS no está definida. Verifica tu archivo .env.');
}
const connBatallas = mongoose.createConnection(process.env.MONGODB_URI_BATALLAS);
const BatallaSchema = require('./models/Batalla').schema;
connBatallas.model('Batalla', BatallaSchema, 'batallas');

const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
	res.setHeader(
		"Content-Security-Policy",
		"default-src 'self'; connect-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline';"
	);
	next();
});
app.get('/', (req, res) => {
	res.send('API Caballeros y Batallas activa');
});
app.use((req, res, next) => {
	if (req.path.startsWith('/api/batallas')) {
		req.db = connBatallas;
	} else {
		req.db = connCaballeros;
	}
	next();
});
app.use('/api', caballeroRoutes);
app.use('/api', batallaRoutes);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`API unificada corriendo en puerto ${PORT}`);
	console.log(`Puedes consultar: http://localhost:${PORT}/api/caballeros`);
	console.log(`Puedes consultar batallas: http://localhost:${PORT}/api/batallas`);
});

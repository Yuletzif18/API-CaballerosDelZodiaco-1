// https://github.com/Yuletzif18/API-CaballerosDelZodiaco-1/blob/main/server.js
// Archivo corregido: unifica el servidor para evitar múltiples procesos en Render,
// añade manejo de errores de conexión a MongoDB, usa PORT de entorno,
// expone GET / como healthcheck y ajusta Content-Security-Policy (CSP).

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const caballeroRoutes = require('./routes/caballeroRoutes');
const batallaRoutes = require('./routes/batallaRoutes');

// URIs deben venir por variables de entorno
const {
  MONGODB_URI_CABALLEROS,
  MONGODB_URI_BATALLAS,
  PORT = process.env.PORT || 3000
} = process.env;

if (!MONGODB_URI_CABALLEROS || !MONGODB_URI_BATALLAS) {
  console.error('ERROR: Falta MONGODB_URI_CABALLEROS o MONGODB_URI_BATALLAS en las variables de entorno.');
  process.exit(1);
}

// Crear conexiones separadas a MongoDB con manejo de errores
const connCaballeros = mongoose.createConnection(MONGODB_URI_CABALLEROS, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
connCaballeros.on('error', (err) => console.error('MongoDB caballeros connection error:', err));
connCaballeros.once('open', () => console.log('Conectado a MongoDB (caballeros)'));

const connBatallas = mongoose.createConnection(MONGODB_URI_BATALLAS, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
connBatallas.on('error', (err) => console.error('MongoDB batallas connection error:', err));
connBatallas.once('open', () => console.log('Conectado a MongoDB (batallas)'));

// Registrar esquemas en cada conexión (si los modelos exportan .schema)
const CaballeroSchema = require('./models/Caballero').schema;
const BatallaSchema = require('./models/Batalla').schema;

connCaballeros.model('Caballero', CaballeroSchema, 'caballeros');
connBatallas.model('Batalla', BatallaSchema, 'batallas');

// App principal (un único proceso - recomendado para Render)
const app = express();

app.use(cors());
app.use(express.json());

// Middleware CSP: permitir 'self' y fuentes necesarias.
// Ajusta la lista de dominios permitidos según tu necesidad.
// Evitamos usar default-src 'none' porque bloquea connect-src por fallback.
app.use((req, res, next) => {
  // Permitir connect to self y al dominio de la app.
  // Si necesitas otros orígenes (CDN, APIs externas) agrégalos a connect-src/script-src/style-src.
  const domain = 'https://caballerosdelzodiaco.onrender.com';
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      `connect-src 'self' ${domain}`,
      "img-src 'self' data:",
      "style-src 'self' 'unsafe-inline'",
      "script-src 'self'",
      // evita exponer demasiados permisos; añade más directivas si hace falta
    ].join('; ')
  );
  next();
});

// Servir uploads de forma estática (si existen)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Healthcheck en la raíz para evitar 404 en GET /
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', app: 'caballerosdelzodiaco' });
});

// Rutas separadas y middleware para inyectar la conexión DB correcta
const caballerosRouter = express.Router();
caballerosRouter.use((req, res, next) => {
  req.db = connCaballeros;
  next();
});
caballerosRouter.use('/api', caballeroRoutes);
// monta en /caballeros para evitar colisiones de rutas
app.use('/caballeros', caballerosRouter);

const batallasRouter = express.Router();
batallasRouter.use((req, res, next) => {
  req.db = connBatallas;
  next();
});
batallasRouter.use('/api', batallaRoutes);
app.use('/batallas', batallasRouter);

// Manejo de rutas no encontradas (404) y errores
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Iniciar servidor usando PORT de entorno (Render lo requiere)
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Healthcheck: http://localhost:${PORT}/`);
  console.log(`Caballeros API: http://localhost:${PORT}/caballeros/api/...`);
  console.log(`Batallas API: http://localhost:${PORT}/batallas/api/...`);
});


require('dotenv').config();
const mongoose = require('mongoose');
const CaballeroSchema = require('./models/Caballero').schema || require('./models/Caballero').CaballeroSchema;
const BatallaSchema = require('./models/Batalla').schema || require('./models/Batalla').BatallaSchema;

const uriCaballeros = process.env.MONGODB_URI_CABALLEROS;
const uriBatallas = process.env.MONGODB_URI_BATALLAS;

if (!uriCaballeros) {
  throw new Error('La variable de entorno MONGODB_URI_CABALLEROS no está definida. Verifica tu archivo .env.');
}
if (!uriBatallas) {
  throw new Error('La variable de entorno MONGODB_URI_BATALLAS no está definida. Verifica tu archivo .env.');
}

const connCaballeros = mongoose.createConnection(uriCaballeros);
const connBatallas = mongoose.createConnection(uriBatallas);

const CaballeroModel = connCaballeros.model('Caballero', CaballeroSchema, 'caballeros');
const BatallaModel = connBatallas.model('Batalla', BatallaSchema, 'batallas');

Promise.all([
  connCaballeros.asPromise(),
  connBatallas.asPromise()
]).then(async () => {
  console.log('Conexión a MongoDB exitosa');
  try {
    const caballeros = await CaballeroModel.find();
    if (caballeros.length > 0) {
      console.log('Colección caballeros leída correctamente:', caballeros);
    } else {
      console.log('Colección caballeros está vacía.');
    }
    const batallas = await BatallaModel.find();
    if (batallas.length > 0) {
      console.log('Colección batallas leída correctamente:', batallas);
    } else {
      console.log('Colección batallas está vacía.');
    }
  } catch (err) {
    console.error('Error al leer las colecciones:', err);
  }
}).catch(err => {
  console.error('Error de conexión a MongoDB:', err);
});

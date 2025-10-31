
const mongoose = require('mongoose');
const Caballero = require('./models/Caballero');
const Batalla = require('./models/Batalla');

const uriCaballeros = 'mongodb+srv://yuletzif2209_db_user:Yule2209@caballerosdelzodiaco.2xuwe9y.mongodb.net/saintseiya_caballeros?retryWrites=true&w=majority';
const uriBatallas = 'mongodb+srv://yuletzif2209_db_user:Yule2209@caballerosdelzodiaco.2xuwe9y.mongodb.net/saintseiya_batallas?retryWrites=true&w=majority';

const connCaballeros = mongoose.createConnection(uriCaballeros);
const connBatallas = mongoose.createConnection(uriBatallas);

const CaballeroModel = connCaballeros.model('Caballero', Caballero.schema, 'caballeros');
const BatallaModel = connBatallas.model('Batalla', Batalla.schema, 'batallas');

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
  // Las conexiones se mantienen abiertas para futuras operaciones
  } catch (err) {
    console.error('Error al leer las colecciones:', err);
  }
}).catch(err => {
  console.error('Error de conexión a MongoDB:', err);
});

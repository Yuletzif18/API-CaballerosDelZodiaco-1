const mongoose = require('mongoose');
const Caballero = require('./models/Caballero');

const uri = mongodb+srv://<DB_USER>:<DB_PASS>@cluster0.example.mongodb.net/saintseiya_caballeros?retryWrites=true&w=majority

mongoose.connect(uri)
  .then(async () => {
    const caballeros = await Caballero.find();
    console.log('Caballeros encontrados:', caballeros);
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error de conexión o consulta:', err);
  });

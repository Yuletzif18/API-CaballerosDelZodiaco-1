const mongoose = require('mongoose');
const Caballero = require('./models/Caballero');

const uri = 'mongodb+srv://yuletzif2209_db_user:Yule2209@caballerosdelzodiaco.2xuwe9y.mongodb.net/caballerosdelzodiaco?retryWrites=true&w=majority';

mongoose.connect(uri)
  .then(async () => {
    const caballeros = await Caballero.find();
    console.log('Caballeros encontrados:', caballeros);
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error de conexión o consulta:', err);
  });

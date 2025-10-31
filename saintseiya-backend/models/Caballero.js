const mongoose = require('mongoose');

const CaballeroSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  signo: String,
  rango: String,
  constelacion: String,
  genero: String,
  imagen: String,
  descripcion: String
});

module.exports = mongoose.model('Caballero', CaballeroSchema, 'caballeros'); // La colección es correcta, pero la BD debe cambiarse en la conexión

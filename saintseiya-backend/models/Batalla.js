const mongoose = require('mongoose');

const BatallaSchema = new mongoose.Schema({
  fecha: String,
  participantes: [String],
  ganador: String,
  ubicacion: String,
  comentario: String
});

module.exports = mongoose.model('Batalla', BatallaSchema, 'batallas'); // La colección es correcta, pero la BD debe cambiarse en la conexión
// Script para actualizar caballeros antiguos y agregar constelacion y genero si faltan
const mongoose = require('mongoose');
const Caballero = require('./models/Caballero');

const MONGO_URI = 'TU_MONGO_URI_AQUI'; // Cambia esto por tu URI real

async function actualizarCaballeros() {
  await mongoose.connect(MONGO_URI);
  const caballeros = await Caballero.find();
  for (const cab of caballeros) {
    let actualizado = false;
    if (!cab.constelacion) {
      cab.constelacion = 'Desconocida'; // Puedes personalizar
      actualizado = true;
    }
    if (!cab.genero) {
      cab.genero = 'Desconocido'; // Puedes personalizar
      actualizado = true;
    }
    if (actualizado) {
      await cab.save();
      console.log(`Actualizado: ${cab.nombre}`);
    }
  }
  mongoose.disconnect();
  console.log('Actualización terminada');
}

actualizarCaballeros();

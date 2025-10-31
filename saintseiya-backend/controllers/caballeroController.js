// Eliminar caballero por nombre
exports.eliminarPorNombre = async (req, res) => {
  const { nombre } = req.params;
  try {
    const Caballero = req.db.model('Caballero');
    const result = await Caballero.deleteOne({ nombre: new RegExp(nombre, 'i') });
    if (result.deletedCount > 0) {
      res.json({ mensaje: 'Caballero eliminado correctamente' });
    } else {
      res.status(404).json({ mensaje: 'No existe en la base de datos' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar caballero', error });
  }
};

// Modificar caballero por nombre
exports.modificarPorNombre = async (req, res) => {
  const { nombre } = req.params;
  const datos = req.body;
  try {
    const Caballero = req.db.model('Caballero');
    // Solo acepta imagen como base64 o string
    if (typeof datos.imagen !== 'string' || datos.imagen.startsWith('[object')) {
      delete datos.imagen;
    }
    const caballero = await Caballero.findOneAndUpdate(
      { nombre: new RegExp(nombre, 'i') },
      datos,
      { new: true }
    );
    if (caballero) {
      res.json({ mensaje: 'Caballero modificado correctamente', caballero });
    } else {
      res.status(404).json({ mensaje: 'No existe en la base de datos' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al modificar caballero', error });
  }
};
// Crear caballero y batalla
exports.crearCaballeroYBatalla = async (req, res) => {
  try {
    const Caballero = req.db.model('Caballero');
    const Batalla = require('../models/Batalla');
    const {
      nombre, signo, rango, constelacion, genero, descripcion,
      fecha, participantes, ganador, ubicacion, comentario, imagen
    } = req.body;

    // Validar duplicado por nombre (case-insensitive)
    const existe = await Caballero.findOne({ nombre: new RegExp(`^${nombre}$`, 'i') });
    if (existe) {
      return res.status(409).json({ mensaje: 'Ya existe un caballero con ese nombre' });
    }

    // Crear caballero con imagen base64
    const nuevoCaballero = new Caballero({ nombre, signo, rango, constelacion, genero, imagen, descripcion });
    await nuevoCaballero.save();

    // Crear batalla si hay datos
    if (fecha && participantes && ganador && ubicacion) {
      const nuevaBatalla = new Batalla({
        fecha,
        participantes: participantes.split(',').map(p => p.trim()),
        ganador,
        ubicacion,
        comentario
      });
      await nuevaBatalla.save();
    }

    res.status(201).json({ mensaje: 'Caballero y batalla creados correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear caballero y batalla', error });
  }
};
// Listar todos los caballeros
exports.listarTodos = async (req, res) => {
  try {
    const Caballero = req.db.model('Caballero');
    const caballeros = await Caballero.find();
    res.json(caballeros);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
}
// El modelo se obtiene de la conexión inyectada

exports.consultarPorNombre = async (req, res) => {
  const { nombre } = req.params;
  try {
    const Caballero = req.db.model('Caballero');
    const caballero = await Caballero.findOne({ nombre: new RegExp(nombre, 'i') });
    if (caballero) {
      res.json(caballero);
    } else {
      res.status(404).json({ mensaje: 'No existe en la base de datos' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

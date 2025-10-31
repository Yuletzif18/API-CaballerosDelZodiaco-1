// Crear una nueva batalla
exports.crearBatalla = async (req, res) => {
  try {
    const Batalla = req.db.model('Batalla');
    let { fecha, participantes, ganador, ubicacion, comentario } = req.body;
    if (typeof participantes === 'string') {
      participantes = participantes.split(',').map(p => p.trim());
    }
    if (!fecha || !participantes || !ganador || !ubicacion || !comentario) {
      return res.status(400).json({ mensaje: 'Todos los campos de batalla son obligatorios' });
    }
    // Validar duplicados: misma fecha, participantes, ganador, ubicacion y comentario
    const existe = await Batalla.findOne({
      fecha,
      participantes: { $all: participantes, $size: participantes.length },
      ganador,
      ubicacion,
      comentario
    });
    if (existe) {
      return res.status(409).json({ mensaje: 'Ya existe una batalla con estos datos' });
    }
    const nuevaBatalla = new Batalla({ fecha, participantes, ganador, ubicacion, comentario });
    await nuevaBatalla.save();
    res.status(201).json({ mensaje: 'Batalla creada correctamente', batalla: nuevaBatalla });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al crear la batalla', error: err.message });
  }
};
// Listar todas las batallas
exports.listarTodas = async (req, res) => {
  try {
    const Batalla = req.db.model('Batalla');
    const batallas = await Batalla.find();
    res.json(batallas);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar batallas' });
  }
}
const Batalla = require('../models/Batalla');

// Consulta batallas por nombre de caballero
exports.getBatallasPorCaballero = async (req, res) => {
  try {
    const Batalla = req.db.model('Batalla');
    const nombre = req.params.nombre;
    const batallas = await Batalla.find({ participantes: new RegExp(nombre, 'i') });
    res.json(batallas);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar batallas' });
  }
};
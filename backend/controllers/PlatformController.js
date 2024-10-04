const Platform = require('../models/Platform');

// Obtener todas las plataformas
exports.getAllPlatforms = async (req, res) => {
  try {
    const platforms = await Platform.find();
    res.status(200).json(platforms);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener plataformas', error });
  }
};

// Crear una nueva plataforma
exports.createPlatform = async (req, res) => {
  try {
    const platform = new Platform(req.body);
    const savedPlatform = await platform.save();
    res.status(201).json(savedPlatform);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear plataforma', error });
  }
};

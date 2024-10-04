const Platform = require('../models/Platform');

// Obtener todas las plataformas
exports.getPlatforms = async (req, res) => {
  try {
    const platforms = await Platform.find();
    res.status(200).json(platforms);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al obtener las plataformas', error });
  }
};

// Obtener una plataforma por ID
exports.getPlatformById = async (req, res) => {
  try {
    const platform = await Platform.findById(req.params.id);
    if (!platform) {
      return res.status(404).json({ message: 'Plataforma no encontrada' });
    }
    res.status(200).json(platform);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la plataforma', error });
  }
};

// Crear una nueva plataforma
exports.createPlatform = async (req, res) => {
  const {
    nombre,
    tipoInstitucion,
    tipoInversion,
    pais,
    description,
    liquidez,
    riesgo,
    logo,
  } = req.body;

  try {
    const newPlatform = new Platform({
      nombre,
      tipoInstitucion,
      tipoInversion,
      pais,
      description,
      liquidez,
      riesgo,
      logo,
    });

    await newPlatform.save();
    res.status(201).json(newPlatform);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la plataforma', error });
  }
};

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
  const { id } = req.params;
  try {
    const platform = await Platform.findById(id);
    if (!platform) {
      return res.status(404).json({ message: 'Plataforma no encontrada' });
    }
    res.status(200).json(platform);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la plataforma', error });
  }
};

// Esta función obtiene los detalles de una plataforma específica, incluyendo los instrumentos
exports.getPlatformDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const platform = await Platform.findById(id);

    if (!platform) {
      return res.status(404).json({ message: 'Plataforma no encontrada' });
    }

    res.status(200).json(platform);
  } catch (error) {
    console.error('Error al obtener detalles de la plataforma:', error);
    res
      .status(500)
      .json({ message: 'Error al obtener detalles de la plataforma', error });
  }
};

// Consulta si la plataforma ya existe
exports.checkPlatformExists = async (req, res) => {
  try {
    const { nombre } = req.params;

    // Usamos regex para buscar el nombre, insensible a mayúsculas/minúsculas
    const platformExists = await Platform.findOne({
      nombre: { $regex: new RegExp(`^${nombre}$`, 'i') },
    });

    if (platformExists) {
      return res.json({
        exists: true,
        message: 'El nombre de la institución ya existe.',
      });
    } else {
      return res.json({
        exists: false,
        message: 'El nombre de la institución está disponible.',
      });
    }
  } catch (error) {
    console.error('Error al verificar la plataforma:', error);
    res
      .status(500)
      .json({ error: 'Error en el servidor al verificar la plataforma' });
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
    res.status(201).json({ message: 'Plataforma creada con éxito.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la plataforma', error });
  }
};

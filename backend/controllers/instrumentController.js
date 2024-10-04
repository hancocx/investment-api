const Instrument = require('../models/Instrument');

// Obtener todos los instrumentos
exports.getInstruments = async (req, res) => {
  try {
    const instruments = await Instrument.find().populate('plataformaId');
    res.status(200).json(instruments);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener instrumentos', error });
  }
};

// Obtener un instrumento por ID
exports.getInstrumentById = async (req, res) => {
  try {
    const instrument = await Instrument.findById(req.params.id).populate(
      'plataformaId'
    );
    if (!instrument) {
      return res.status(404).json({ message: 'Instrumento no encontrado' });
    }
    res.status(200).json(instrument);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el instrumento', error });
  }
};

// Crear un instrumento
exports.createInstrument = async (req, res) => {
  try {
    const { plataformaId, plazo, interesBruto, liquidez, riesgo } = req.body;

    // Calculamos el GAT aquí en el backend
    const { GATNominal, GATReal } = calculateGAT(interesBruto);

    // Crear el instrumento con los valores enviados desde el frontend
    const newInstrument = new Instrument({
      plataforma,
      institucion,
      tipoInversion,
      programa,
      montoMinimo,
      montoMaximo,
      plazo,
      interesBruto,
      GATNominal, // Valor calculado
      GATReal, // Valor calculado
      liquidez,
      riesgo,
    });

    // Guardamos el instrumento en la base de datos
    const savedInstrument = await newInstrument.save();

    // Se envia el instrumento creado con los cálculos al frontend
    res.status(201).json(savedInstrument);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear instrumento' });
  }
};

// Cálculo del GAT Nominal y GAT Real
const calculateGAT = (interesBruto) => {
  const inflationRate = 0.038; // Inflación esperada (3.8%)
  const diasCapitalizacion = 360; // Usamos 360 días para la capitalización

  const interesBrutoDecimal = interesBruto / 100;
  const GATNominal =
    Math.pow(1 + interesBrutoDecimal / diasCapitalizacion, diasCapitalizacion) -
    1;
  const GATReal = (1 + GATNominal) / (1 + inflationRate) - 1;

  return { GATNominal: GATNominal * 100, GATReal: GATReal * 100 }; // Convertimos de vuelta a porcentaje
};

// Actualizar un instrumento
exports.updateInstrument = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      plataforma,
      institucion,
      tipoInversion,
      programa,
      montoMinimo,
      montoMaximo,
      plazo,
      interesBruto,
      liquidez,
      riesgo,
    } = req.body;

    // Calculamos GAT Nominal y GAT Real nuevamente si cambia el interés bruto
    let GATNominal, GATReal;
    if (interesBruto) {
      const calculatedGAT = calculateGAT(interesBruto);
      GATNominal = calculatedGAT.GATNominal;
      GATReal = calculatedGAT.GATReal;
    }

    const updatedInstrument = await Instrument.findByIdAndUpdate(
      id,
      {
        ...req.body,
        fechaActualizacion: Date.now(),
      },
      { new: true }
    );

    if (!updatedInstrument) {
      return res.status(404).json({ message: 'Instrumento no encontrado' });
    }

    res.status(200).json(updatedInstrument);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar un instrumento
exports.deleteInstrument = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedInstrument = await Instrument.findByIdAndDelete(id);

    if (!deletedInstrument) {
      return res.status(404).json({ message: 'Instrumento no encontrado' });
    }

    res.status(200).json({ message: 'Instrumento eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

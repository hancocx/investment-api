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

// Crear un nuevo instrumento
exports.createInstrument = async (req, res) => {
  const { plataformaId, plazo, interesBruto } = req.body;

  // Calcular GAT Nominal y GAT Real
  const diasCapitalizacion = 360;
  const inflationRate = 0.038;

  const interesBrutoDecimal = interesBruto / 100;
  const GATNominal =
    Math.pow(1 + interesBrutoDecimal / diasCapitalizacion, diasCapitalizacion) -
    1;
  const GATReal = (1 + GATNominal) / (1 + inflationRate) - 1;

  try {
    const newInstrument = new Instrument({
      plataformaId,
      plazo,
      interesBruto,
      GATNominal: (GATNominal * 100).toFixed(2),
      GATReal: (GATReal * 100).toFixed(2),
    });

    await newInstrument.save();
    res.status(201).json(newInstrument);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear instrumento', error });
  }
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

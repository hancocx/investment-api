const Instrument = require('../models/Instrument');

// Cálculo del GAT Nominal y GAT Real
const calculateGAT = (interesBruto) => {
  const inflationRate = 0.038;
  const GATNominal = interesBruto - inflationRate;
  const GATReal = GATNominal - inflationRate;
  return { GATNominal, GATReal };
};

// Crear un instrumento
exports.createInstrument = async (req, res) => {
  try {
    const { interesBruto } = req.body;
    const { GATNominal, GATReal } = calculateGAT(interesBruto);

    const instrument = new Instrument({
      ...req.body,
      GATNominal,
      GATReal,
    });

    const savedInstrument = await instrument.save();
    res.status(201).json(savedInstrument);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Obtener todos los instrumentos
exports.getInstruments = async (req, res) => {
  try {
    const instruments = await Instrument.find();
    res.status(200).json(instruments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar un instrumento
exports.updateInstrument = async (req, res) => {
  try {
    const { id } = req.params;
    const { interesBruto } = req.body;

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
        ...(GATNominal !== undefined && { GATNominal }),
        ...(GATReal !== undefined && { GATReal }),
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

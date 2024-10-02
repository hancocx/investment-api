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

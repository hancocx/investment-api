const Instrument = require('../models/Instrument');

// Crear un instrumento
exports.createInstrument = async (req, res) => {
  try {
    const {
      plataforma,
      institucion,
      tipoInversion,
      programa,
      montoMinimo,
      montoMaximo,
      plazo,
      interesBruto,
      GATNominal,
      GATReal,
      liquidez,
      riesgo,
    } = req.body;

    // Crear el instrumento con los valores enviados desde el frontend
    const instrument = new Instrument({
      plataforma,
      institucion,
      tipoInversion,
      programa,
      montoMinimo,
      montoMaximo,
      plazo,
      interesBruto,
      GATNominal,
      GATReal,
      liquidez,
      riesgo,
    });

    const savedInstrument = await instrument.save();
    res.status(201).json(savedInstrument);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Obtener todos los instrumentos
export const fetchInstruments = async () => {
  const response = await fetch('http://localhost:5000/api/instruments'); // Ajusta la URL según tu API
  const data = await response.json();
  return data;
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

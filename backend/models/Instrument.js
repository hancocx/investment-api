const mongoose = require('mongoose');

const InstrumentSchema = new mongoose.Schema({
  plataforma: { type: String, required: true },
  institucion: { type: String, required: true },
  tipoInversion: { type: String, required: true },
  programa: { type: String, required: true },
  montoMinimo: { type: Number, required: true },
  montoMaximo: { type: Number, required: true },
  plazo: { type: String, required: true }, // 'A la vista', 'días', 'meses', 'años'
  interesBruto: { type: Number, required: true },
  GATNominal: { type: Number },
  GATReal: { type: Number },
  liquidez: { type: String, enum: ['Alta', 'Media', 'Baja'], required: true },
  riesgo: { type: String, enum: ['Alto', 'Medio', 'Bajo'], required: true },
  fechaAlta: { type: Date, default: Date.now },
  fechaActualizacion: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Instrument', InstrumentSchema);

const mongoose = require('mongoose');

const InstrumentSchema = new mongoose.Schema(
  {
    plataforma: String,
    institucion: String,
    tipoInversion: String,
    programa: String,
    montoMinimo: Number,
    montoMaximo: Number,
    plazo: String,
    interesBruto: Number,
    GATNominal: Number,
    GATReal: Number,
    liquidez: String,
    riesgo: String,
  },
  {
    timestamps: { createdAt: 'fechaAlta', updatedAt: 'fechaActualizacion' },
  }
);

module.exports = mongoose.model('Instrument', InstrumentSchema);

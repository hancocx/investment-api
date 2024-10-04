const mongoose = require('mongoose');

// Model for Instrument (with reference to Platform)
const InstrumentSchema = new mongoose.Schema(
  {
    plataformaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Platform',
      required: true,
    },
    plazo: { type: String, required: true },
    interesBruto: { type: Number, required: true },
    GATNominal: { type: Number },
    GATReal: { type: Number },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt`
  }
);

module.exports = mongoose.model('Instrument', InstrumentSchema);

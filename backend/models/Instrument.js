const mongoose = require('mongoose');

// Model for Instrument (with reference to Platform)
const InstrumentSchema = new mongoose.Schema(
  {
    plataforma: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Platform',
      required: true,
    },
    instrumentos: [
      {
        plazo: { type: String, required: true },
        interesBruto: { type: Number, required: true },
        GATNominal: String,
        GATReal: String,
      },
    ],
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt`
  }
);

module.exports = mongoose.model('Instrument', InstrumentSchema);

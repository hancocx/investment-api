/**
 * Este modelo será el que se encargue de almacenar los
 * atributos que varían para cada instrumento, como el
 * plazo, interés bruto, GAT nominal y GAT real, haciendo
 * referencia al modelo de Platform para obtener la
 * plataforma e institución.
 */
const mongoose = require('mongoose');

// Modelo para Plataforma/Institución
const PlatformSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      unique: true,
    },
    tipoInstitucion: {
      type: String,
      required: true,
      enum: [
        'Banco Digital',
        'Banco Tradicional',
        'Crowdlending',
        'Crowdfunding Inmobiliario',
        'Crowdfunding Préstamos P2P',
        'Cuenta Digital',
        'Factoraje a Pymes',
        'Inversión en Franquicias',
        'Inversión en Paneles Solares',
        'Inversión en Startups',
        'SOFIPO',
        'SOFIPO / Crowdlending',
      ],
    },
    tipoInversion: {
      type: String,
      required: true,
      enum: ['Renta Fija', 'Renta Variable'],
    },
    pais: {
      type: String,
      default: 'México', // O cualquier otro país por defecto
    },
    liquidez: {
      type: String,
      required: true,
      enum: ['Alta', 'Media', 'Baja'],
    },
    riesgo: {
      type: String,
      required: true,
      enum: ['Alto', 'Medio', 'Bajo'],
    },
    description: {
      type: String,
    },
    logo: {
      type: String, // URL o path al logo de la plataforma
    },
    instruments: [
      {
        plazo: String,
        interesBruto: Number,
        GATNominal: Number,
        GATReal: Number,
      },
    ],
  },
  {
    timestamps: true, // Para gestionar `createdAt` y `updatedAt`
  }
);

module.exports = mongoose.model('Platform', PlatformSchema);

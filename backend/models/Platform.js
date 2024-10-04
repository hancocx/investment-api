/**
 * Este modelo será el que se encargue de almacenar los
 * atributos que varían para cada instrumento, como el
 * plazo, interés bruto, GAT nominal y GAT real, haciendo
 * referencia al modelo de Platform para obtener la
 * plataforma e institución.
 */
const mongoose = require('mongoose');

// Modelo para Plataforma/Institución
const PlatformSchema = new mongoose.Schema({
  plataforma: { type: String, required: true },
  institucion: { type: String, required: true },
  tipoInversion: { type: String, required: true },
  liquidez: { type: String, required: true },
  riesgo: { type: String, required: true },
});

module.exports = mongoose.model('Platform', PlatformSchema);

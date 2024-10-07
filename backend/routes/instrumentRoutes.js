const express = require('express');
const router = express.Router();
const {
  getInstruments,
  getInstrumentById,
  createInstrument,
  updateInstrument,
  deleteInstrument,
} = require('../controllers/instrumentController');

// Rutas
router.get('/instruments', getInstruments);
router.post('/instrument/create', createInstrument);
router.put('/platforms/:id/instruments/:instrumentId', updateInstrument);
router.delete('/platforms/:id/instruments/:instrumentId', deleteInstrument);

module.exports = router;

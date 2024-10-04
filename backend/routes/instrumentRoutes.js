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
router.put('/instrument/:id', updateInstrument);
router.delete('/instrument/:id', deleteInstrument);

module.exports = router;

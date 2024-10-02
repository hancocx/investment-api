const express = require('express');
const router = express.Router();
const {
  createInstrument,
  getInstruments,
  updateInstrument,
  deleteInstrument,
} = require('../controllers/instrumentController');

// Rutas
router.post('/', createInstrument);
router.get('/', getInstruments);
router.put('/:id', updateInstrument);
router.delete('/:id', deleteInstrument);

module.exports = router;

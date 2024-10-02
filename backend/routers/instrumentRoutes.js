const express = require('express');
const router = express.Router();
const {
  createInstrument,
  getInstruments,
} = require('../controllers/instrumentController');

router.post('/', createInstrument);
router.get('/', getInstruments);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getPlatforms,
  getPlatformById,
  createPlatform,
  updatePlatform,
  deletePlatform,
} = require('../controllers/platformController');

// Rutas para CRUD de plataformas
router.get('/platforms', getPlatforms);
router.get('/platform/:id', getPlatformById);
router.post('/platform/create', createPlatform);
/*router.put('/platform/:id', updatePlatform);
router.delete('/platform/:id', deletePlatform);*/

module.exports = router;

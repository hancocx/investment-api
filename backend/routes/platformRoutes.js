const express = require('express');
const router = express.Router();
const {
  getPlatforms,
  createPlatform,
  getPlatformById,
  checkPlatformExists,
  updatePlatform,
  deletePlatform,
} = require('../controllers/platformController');

// Rutas para CRUD de plataformas
router.get('/platforms', getPlatforms);
router.get('/platform/:id', getPlatformById);
router.post('/platform/create', createPlatform);
/*router.put('/platform/:id', updatePlatform);
router.delete('/platform/:id', deletePlatform);*/

// Ruta para verificar si la plataforma ya existe
router.get('/platform-exists/:nombre', checkPlatformExists);

module.exports = router;

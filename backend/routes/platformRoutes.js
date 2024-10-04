const express = require('express');
const router = express.Router();

const {
  getAllPlatforms,
  createPlatform,
} = require('../controllers/PlatformController');

router.get('/platforms', getAllPlatforms);
router.post('/platforms/create', createPlatform);

module.exports = router;

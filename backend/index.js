require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const instrumentRoutes = require('./routes/instrumentRoutes');
const platformRoutes = require('./routes/platformRoutes');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/v1', platformRoutes); // Rutas de plataformas
app.use('/api/v1', instrumentRoutes); // Rutas de intrumentos

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

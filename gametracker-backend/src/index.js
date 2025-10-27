const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// importar rutas
const reviewsRouter = require('./routes/reviews');
const gamesRoutes = require('./routes/games');
app.use('/api/reviews', reviewsRouter);
app.use('/api/games', gamesRoutes);

const PORT = process.env.PORT || 5000;
connectDB(process.env.MONGO_URI)
 .then(() => app.listen(PORT, () => console.log(`servidor corriendo en puerto ${PORT}`)))
 .catch((err) => console.error(err));

 

// Ruta de bienvenida más descriptiva
app.get('/', (req, res) => {
  res.json({ 
    message: '🎮 GameTracker API funcionando',
    version: '1.0.0',
    endpoints: {
      games: '/api/games',
      stats: '/api/stats'
    },
    documentation: 'Usa el frontend en http://localhost:5173'
  });
});



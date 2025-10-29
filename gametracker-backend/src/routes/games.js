const express = require('express');
const router = express.Router();
const Game = require('../models/Game');

// GET - Obtener todos los juegos
router.get('/', async (req, res) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 });
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Obtener un juego por ID
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Juego no encontrado' });
    }
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Crear un nuevo juego (CON DEBUG COMPLETO)
router.post('/', async (req, res) => {
  try {
    console.log('🔍 === BACKEND - DATOS RECIBIDOS ===');
    console.log('📦 Body RAW:', JSON.stringify(req.body, null, 2));
    console.log('📋 Content-Type:', req.headers['content-type']);
    
    // Verificar CADA campo requerido
    const campos = [
      'title', 'genre', 'platform', 'releaseDate', 
      'developer', 'publisher', 'description', 'coverImageUrl'
    ];
    
    console.log('📝 VERIFICACIÓN DE CAMPOS:');
    campos.forEach(campo => {
      const valor = req.body[campo];
      console.log(`   ${campo}:`, valor ? `"${valor}"` : '❌ FALTANTE');
    });

    // DEBUG: Verificar si el body está vacío
    if (Object.keys(req.body).length === 0) {
      console.log('❌ ERROR: req.body está VACÍO');
      return res.status(400).json({ 
        message: 'El cuerpo de la petición está vacío',
        receivedHeaders: req.headers 
      });
    }

    // Verificar si faltan campos requeridos
    const camposFaltantes = campos.filter(campo => !req.body[campo]);
    if (camposFaltantes.length > 0) {
      console.log('❌ CAMPOS FALTANTES:', camposFaltantes);
      return res.status(400).json({
        message: `Campos requeridos faltantes: ${camposFaltantes.join(', ')}`,
        missingFields: camposFaltantes
      });
    }

    console.log('🎯 Intentando crear juego en MongoDB...');
    
    // Crear el juego con cada campo explícitamente
    const game = new Game({
      title: req.body.title,
      genre: req.body.genre,
      platform: req.body.platform,
      releaseDate: req.body.releaseDate,
      developer: req.body.developer,
      publisher: req.body.publisher,
      description: req.body.description,
      coverImageUrl: req.body.coverImageUrl,
      averageRating: req.body.averageRating || 0,
      totalReviews: req.body.totalReviews || 0,
      hoursPlayed: req.body.hoursPlayed || 0,
      completed: req.body.completed || false
    });

    console.log('💾 Objeto Game creado:', game);
    
    const newGame = await game.save();
    
    console.log('✅ JUEGO CREADO EXITOSAMENTE! ID:', newGame._id);
    console.log('📊 Juego guardado:', JSON.stringify(newGame, null, 2));
    
    res.status(201).json(newGame);
    
  } catch (error) {
    console.error('❌ ERROR AL GUARDAR EN MONGODB:');
    console.error('📋 Nombre del error:', error.name);
    console.error('📋 Mensaje:', error.message);
    
    if (error.name === 'ValidationError') {
      console.error('🔍 Errores de validación detallados:');
      Object.keys(error.errors).forEach(field => {
        const err = error.errors[field];
        console.error(`   - ${field}: ${err.message}`);
        console.error(`     Valor recibido: ${err.value}`);
        console.error(`     Tipo: ${err.value ? typeof err.value : 'undefined'}`);
      });
    }

    if (error.name === 'CastError') {
      console.error('🔍 Error de casteo:', error);
    }
    
    console.error('💾 Datos que causaron el error:', JSON.stringify(req.body, null, 2));
    
    res.status(400).json({ 
      message: error.message,
      errorType: error.name,
      validationErrors: error.errors || error.message,
      receivedData: req.body
    });
  }
});

// PUT - Actualizar un juego
router.put('/:id', async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!game) {
      return res.status(404).json({ message: 'Juego no encontrado' });
    }
    res.json(game);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE - Eliminar un juego
router.delete('/:id', async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Juego no encontrado' });
    }
    res.json({ message: 'Juego eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Game = require('../models/Game');

// GET - Obtener todas las reseñas
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('juegoId', 'title platform coverImageUrl')
      .sort({ fechaCreacion: -1 });
    
    res.json(reviews);
  } catch (error) {
    console.error('Error obteniendo reseñas:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET - Obtener reseñas de un juego específico
router.get('/juego/:juegoId', async (req, res) => {
  try {
    const { juegoId } = req.params;
    
    // Verificar que el juego existe
    const game = await Game.findById(juegoId);
    if (!game) {
      return res.status(404).json({ message: 'Juego no encontrado' });
    }

    const reviews = await Review.find({ juegoId })
      .populate('juegoId', 'title platform coverImageUrl')
      .sort({ fechaCreacion: -1 });
    
    res.json({
      juego: game,
      reseñas: reviews,
      total: reviews.length,
      promedioPuntuacion: reviews.length > 0 
        ? (reviews.reduce((sum, review) => sum + review.puntuacion, 0) / reviews.length).toFixed(1)
        : 0
    });
  } catch (error) {
    console.error('Error obteniendo reseñas del juego:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST - Crear nueva reseña
router.post('/', async (req, res) => {
  try {
    console.log('📝 Creando nueva reseña:', req.body);
    
    // Verificar que el juego existe
    const game = await Game.findById(req.body.juegoId);
    if (!game) {
      return res.status(404).json({ message: 'Juego no encontrado' });
    }

    // Verificar que no existe ya una reseña para este juego
    const existingReview = await Review.findOne({ juegoId: req.body.juegoId });
    if (existingReview) {
      return res.status(400).json({ 
        message: 'Ya existe una reseña para este juego',
        reseñaExistente: existingReview 
      });
    }

    const review = new Review(req.body);
    const newReview = await review.save();
    
    // Popular la reseña con datos del juego
    const populatedReview = await Review.findById(newReview._id)
      .populate('juegoId', 'title platform coverImageUrl');
    
    console.log('✅ Reseña creada exitosamente');
    res.status(201).json(populatedReview);
  } catch (error) {
    console.error('❌ Error creando reseña:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Error de validación', 
        errors 
      });
    }
    
    res.status(400).json({ message: error.message });
  }
});

// PUT - Actualizar reseña existente
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const review = await Review.findByIdAndUpdate(
      id,
      { ...req.body, fechaActualizacion: Date.now() },
      { new: true, runValidators: true }
    ).populate('juegoId', 'title platform coverImageUrl');
    
    if (!review) {
      return res.status(404).json({ message: 'Reseña no encontrada' });
    }
    
    console.log('✅ Reseña actualizada:', review._id);
    res.json(review);
  } catch (error) {
    console.error('❌ Error actualizando reseña:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Error de validación', 
        errors 
      });
    }
    
    res.status(400).json({ message: error.message });
  }
});

// DELETE - Eliminar reseña
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const review = await Review.findByIdAndDelete(id);
    
    if (!review) {
      return res.status(404).json({ message: 'Reseña no encontrada' });
    }
    
    console.log('🗑️ Reseña eliminada:', id);
    res.json({ message: 'Reseña eliminada exitosamente' });
  } catch (error) {
    console.error('❌ Error eliminando reseña:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET - Estadísticas personales de reseñas
router.get('/estadisticas/personales', async (req, res) => {
  try {
    const totalReseñas = await Review.countDocuments();
    const reseñasPorDificultad = await Review.aggregate([
      {
        $group: {
          _id: '$dificultad',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const reseñasRecomendadas = await Review.countDocuments({ recomendaria: true });
    const promedioHorasJugadas = await Review.aggregate([
      {
        $group: {
          _id: null,
          promedio: { $avg: '$horasJugadas' }
        }
      }
    ]);
    
    const promedioPuntuacion = await Review.aggregate([
      {
        $group: {
          _id: null,
          promedio: { $avg: '$puntuacion' }
        }
      }
    ]);

    const estadisticas = {
      totalReseñas,
      reseñasPorDificultad: reseñasPorDificultad.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      porcentajeRecomendacion: totalReseñas > 0 ? (reseñasRecomendadas / totalReseñas * 100).toFixed(1) : 0,
      promedioHorasJugadas: promedioHorasJugadas[0]?.promedio || 0,
      promedioPuntuacion: promedioPuntuacion[0]?.promedio || 0,
      juegosConReseña: await Review.distinct('juegoId').then(ids => ids.length)
    };

    res.json(estadisticas);
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;


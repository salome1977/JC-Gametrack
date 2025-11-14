const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  juegoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  puntuacion: {type: Number, required: true, min: 1, max: 5 },
  textoReseña: { type: String, required: true, trim: true, maxlength: 2000 },
  horasJugadas: { type: Number, required: true, min: 0 },
  dificultad: {type: String, required: true, enum: ['Fácil', 'Normal', 'Difícil'] },
  recomendaria: { type: Boolean, required: true },
  fechaCreacion: { type: Date, default: Date.now },
  fechaActualizacion: { type: Date, default: Date.now}
});

// Actualizar fechaActualizacion antes de guardar (al dia)
reviewSchema.pre('save', function(next) {
  this.fechaActualizacion = Date.now();
  next();
});

module.exports = mongoose.model('Review', reviewSchema);
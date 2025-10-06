const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    game : {type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true}, // referencia al juego
    user: {type: String, required: true}, // nombre del usuario que hizo la reseña
    title: {type: String, required: true}, // titulo de la reseña
    rating: {type: Number, required: true, min: 0, max: 5}, // calificacion del juego del 0 al 5
    comment: {type: String, required: true}, // comentario de la reseña
    hoursAtReview: {type: Number, required: true, min: 0}, // horas jugadas al momento de la reseña
}, { timestamps : true });

module.exports = mongoose.model('Review', ReviewSchema);
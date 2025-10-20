const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({ // informacion del juego
    title: {type: String, required: true}, // titulo del juego
    genre: {type: String, required: true}, // genero del juego
    platform: {type: String, required: true, enum: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile', 'Other']},// plataforma del juego
    releaseDate: {type: Date, required: true},// fecha de lanzamiento
    developer: {type: String, required: true},// desarrollador del juego
    publisher: {type: String, required: true},// publicador del juego
    description: {type: String, required: true},// descripcion del juego
    coverImageUrl: {type: String, required: true},// url de la imagen de portada
    averageRating: {type: Number, default: 0,min: 0, max: 5 },// calificacion promedio se calufican del 0 al 5
    totalReviews: {type: Number, default: 0},// total de reseñas
    hoursPlayed: {type: Number, default: 0, min:0},// horas jugadas
    completed: {type: Boolean, default: false}// si el juego fue completado
    },
    { timestamps : true });
module.exports = mongoose.model('Game', GameSchema);
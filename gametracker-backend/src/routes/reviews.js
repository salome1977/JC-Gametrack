const mongoose = require('mongoose');
const ReviewSchema = new mongoose.Schema({
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
    autor: String,
    title: String,
    rating: { type: Number, min: 0, max: 5 },
    hoursAtReview: Number
   });
   { timestamps: true }
module.exports = mongoose.model('Review', ReviewSchema);


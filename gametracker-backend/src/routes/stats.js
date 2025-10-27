const express = require('express');
const router = express.Router();
const Game = require('../models/Game');

// GET - Estadísticas generales
router.get('/', async (req, res) => {
  try {
    const totalGames = await Game.countDocuments();
    const completedGames = await Game.countDocuments({ status: 'Completed' });
    const totalHours = await Game.aggregate([
      { $group: { _id: null, total: { $sum: '$hoursPlayed' } } }
    ]);
    const gamesByPlatform = await Game.aggregate([
      { $group: { _id: '$platform', count: { $sum: 1 } } }
    ]);
    const gamesByStatus = await Game.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const averageRating = await Game.aggregate([
      { $match: { rating: { $gt: 0 } } },
      { $group: { _id: null, average: { $avg: '$rating' } } }
    ]);

    res.json({
      totalGames,
      completedGames,
      totalHours: totalHours[0]?.total || 0,
      gamesByPlatform,
      gamesByStatus,
      averageRating: averageRating[0]?.average || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
import React, { useState, useEffect } from 'react';
import { statsService, gameService } from '../services/api';
import './Statistics.css';

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      
      // Cargar estadísticas y juegos
      const [statsResponse, gamesResponse] = await Promise.all([
        statsService.getStats(),
        gameService.getAllGames()
      ]);

      setStats(statsResponse.data);
      setGames(gamesResponse.data);
      
    } catch (err) {
      console.error('Error cargando estadísticas:', err);
      setError('Error al cargar las estadísticas');
    } finally {
      setLoading(false);
    }
  };

  // Calcular estadísticas adicionales
  const calculateAdditionalStats = () => {
    if (!games.length) return {};

    const totalHours = games.reduce((sum, game) => sum + (game.hoursPlayed || 0), 0);
    const completedGames = games.filter(game => game.completed).length;
    const averageRating = games.reduce((sum, game) => sum + (game.averageRating || 0), 0) / games.length;
    const mostPlayedGame = games.reduce((max, game) => 
      (game.hoursPlayed || 0) > (max.hoursPlayed || 0) ? game : max, games[0]
    );

    return {
      totalHours,
      completedGames,
      averageRating: averageRating || 0,
      mostPlayedGame,
      totalGames: games.length
    };
  };

  const additionalStats = calculateAdditionalStats();

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Cargando estadísticas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">
          {error}
          <button 
            onClick={loadStatistics}
            style={{ marginLeft: '10px', padding: '5px 10px' }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container">
        <div className="error-message">
          No se pudieron cargar las estadísticas
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>📊 Estadísticas de Mi Biblioteca</h1>
      
      {/* Tarjetas de Estadísticas Principales */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🎮</div>
          <div className="stat-value">{additionalStats.totalGames}</div>
          <div className="stat-label">Juegos Totales</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{additionalStats.completedGames}</div>
          <div className="stat-label">Juegos Completados</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-value">{additionalStats.totalHours}</div>
          <div className="stat-label">Horas Totales</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-value">{additionalStats.averageRating.toFixed(1)}</div>
          <div className="stat-label">Calificación Promedio</div>
        </div>
      </div>

      {/* Juego Más Jugado */}
      {additionalStats.mostPlayedGame && additionalStats.mostPlayedGame.hoursPlayed > 0 && (
        <div className="featured-stat">
          <h3>🎯 Juego Más Jugado</h3>
          <div className="most-played-card">
            <div 
              className="most-played-image"
              style={{ 
                backgroundImage: additionalStats.mostPlayedGame.coverImageUrl ? 
                  `url(${additionalStats.mostPlayedGame.coverImageUrl})` : 
                  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              {!additionalStats.mostPlayedGame.coverImageUrl && <span>🎮</span>}
            </div>
            <div className="most-played-info">
              <h4>{additionalStats.mostPlayedGame.title}</h4>
              <p>{additionalStats.mostPlayedGame.platform}</p>
              <div className="most-played-hours">
                <strong>{additionalStats.mostPlayedGame.hoursPlayed} horas</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gráficos de Distribución */}
      <div className="charts-container">
        {/* Juegos por Plataforma */}
        <div className="chart-section">
          <h3>📱 Juegos por Plataforma</h3>
          <div className="chart">
            {games.reduce((platforms, game) => {
              const platform = game.platform || 'Other';
              platforms[platform] = (platforms[platform] || 0) + 1;
              return platforms;
            }, {}) && Object.entries(games.reduce((platforms, game) => {
              const platform = game.platform || 'Other';
              platforms[platform] = (platforms[platform] || 0) + 1;
              return platforms;
            }, {})).map(([platform, count]) => (
              <div key={platform} className="chart-item">
                <div className="chart-label">{platform}</div>
                <div className="chart-bar-container">
                  <div 
                    className="chart-bar"
                    style={{ 
                      width: `${(count / additionalStats.totalGames) * 100}%`,
                      backgroundColor: getPlatformColor(platform)
                    }}
                  >
                    <span className="chart-value">{count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Juegos Completados vs No Completados */}
        <div className="chart-section">
          <h3>🎯 Estado de Completado</h3>
          <div className="completion-chart">
            <div className="completion-item">
              <div className="completion-label">Completados</div>
              <div className="completion-bar-container">
                <div 
                  className="completion-bar completed"
                  style={{ 
                    width: `${(additionalStats.completedGames / additionalStats.totalGames) * 100}%` 
                  }}
                >
                  <span className="completion-value">{additionalStats.completedGames}</span>
                </div>
              </div>
            </div>
            <div className="completion-item">
              <div className="completion-label">No Completados</div>
              <div className="completion-bar-container">
                <div 
                  className="completion-bar not-completed"
                  style={{ 
                    width: `${((additionalStats.totalGames - additionalStats.completedGames) / additionalStats.totalGames) * 100}%` 
                  }}
                >
                  <span className="completion-value">{additionalStats.totalGames - additionalStats.completedGames}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resumen de Géneros */}
      {games.length > 0 && (
        <div className="genres-section">
          <h3>🎨 Géneros Más Comunes</h3>
          <div className="genres-list">
            {Object.entries(games.reduce((genres, game) => {
              const gameGenres = game.genre ? game.genre.split(',').map(g => g.trim()) : ['Sin género'];
              gameGenres.forEach(genre => {
                genres[genre] = (genres[genre] || 0) + 1;
              });
              return genres;
            }, {})).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([genre, count]) => (
              <div key={genre} className="genre-item">
                <span className="genre-name">{genre}</span>
                <span className="genre-count">{count} juegos</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Función para colores de plataformas
const getPlatformColor = (platform) => {
  const colors = {
    'PC': '#3b82f6',
    'PlayStation': '#00439c',
    'Xbox': '#107c10',
    'Nintendo Switch': '#e60012',
    'Mobile': '#8b5cf6',
    'Other': '#6b7280'
  };
  return colors[platform] || '#6b7280';
};

export default Statistics;
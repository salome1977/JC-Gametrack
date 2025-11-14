import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reviewService } from '../services/reviewService';
import './PersonalStats.css';

const PersonalStats = () => {
  const [stats, setStats] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsResponse, reviewsResponse] = await Promise.all([
        reviewService.getPersonalStats(),
        reviewService.getAllReviews()
      ]);

      setStats(statsResponse.data);
      setReviews(reviewsResponse.data);
    } catch (err) {
      setError('Error al cargar las estadísticas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (dificultad) => {
    const colors = {
      'Fácil': '#10b981',
      'Normal': '#3b82f6',
      'Difícil': '#ef4444'
    };
    return colors[dificultad] || '#6b7280';
  };

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
            onClick={loadData}
            style={{ marginLeft: '10px' }}
            className="btn btn-primary"
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
        <div className="empty-state">
          <h3>No hay estadísticas disponibles</h3>
          <p>Escribe tu primera reseña para ver estadísticas</p>
          <Link to="/reseñas/nueva" className="btn btn-primary">
            Escribir Primera Reseña
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>📊 Mis Estadísticas de Reseñas</h1>
        <Link to="/reseñas" className="btn btn-primary">
          📝 Ver Todas las Reseñas
        </Link>
      </div>

      {/* Tarjetas de Estadísticas Principales */}
      <div className="stats-grid">
        <div className="stat-card main-stat">
          <div className="stat-icon">📝</div>
          <div className="stat-value">{stats.totalReseñas}</div>
          <div className="stat-label">Reseñas Totales</div>
        </div>

        <div className="stat-card main-stat">
          <div className="stat-icon">🎮</div>
          <div className="stat-value">{stats.juegosConReseña}</div>
          <div className="stat-label">Juegos Reseñados</div>
        </div>

        <div className="stat-card main-stat">
          <div className="stat-icon">⭐</div>
          <div className="stat-value">{stats.promedioPuntuacion.toFixed(1)}</div>
          <div className="stat-label">Puntuación Promedio</div>
        </div>

        <div className="stat-card main-stat">
          <div className="stat-icon">⏱️</div>
          <div className="stat-value">{stats.promedioHorasJugadas.toFixed(0)}</div>
          <div className="stat-label">Horas Promedio</div>
        </div>
      </div>

      {/* Gráficos de Distribución */}
      <div className="charts-container">
        {/* Distribución por Dificultad */}
        <div className="chart-section">
          <h3>🎯 Distribución por Dificultad</h3>
          <div className="chart">
            {Object.entries(stats.reseñasPorDificultad).map(([dificultad, count]) => (
              <div key={dificultad} className="chart-item">
                <div className="chart-label">{dificultad}</div>
                <div className="chart-bar-container">
                  <div 
                    className="chart-bar"
                    style={{ 
                      width: `${(count / stats.totalReseñas) * 100}%`,
                      backgroundColor: getDifficultyColor(dificultad)
                    }}
                  >
                    <span className="chart-value">{count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recomendaciones */}
        <div className="chart-section">
          <h3>👍 Porcentaje de Recomendación</h3>
          <div className="recommendation-chart">
            <div className="recommendation-item">
              <div className="recommendation-label">Recomendados</div>
              <div className="recommendation-bar-container">
                <div 
                  className="recommendation-bar yes"
                  style={{ width: `${stats.porcentajeRecomendacion}%` }}
                >
                  <span className="recommendation-value">
                    {stats.porcentajeRecomendacion}%
                  </span>
                </div>
              </div>
            </div>
            <div className="recommendation-item">
              <div className="recommendation-label">No Recomendados</div>
              <div className="recommendation-bar-container">
                <div 
                  className="recommendation-bar no"
                  style={{ width: `${100 - stats.porcentajeRecomendacion}%` }}
                >
                  <span className="recommendation-value">
                    {(100 - stats.porcentajeRecomendacion).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resumen de Reseñas Recientes */}
      {reviews.length > 0 && (
        <div className="recent-reviews">
          <h3>📋 Reseñas Más Recientes</h3>
          <div className="reviews-list">
            {reviews.slice(0, 5).map(review => (
              <div key={review._id} className="review-summary">
                <div 
                  className="review-game-image"
                  style={{ 
                    backgroundImage: review.juegoId.coverImageUrl ? 
                      `url(${review.juegoId.coverImageUrl})` : 
                      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}
                />
                <div className="review-summary-info">
                  <h4>{review.juegoId.title}</h4>
                  <div className="review-meta">
                    <span className="rating">⭐ {review.puntuacion}/5</span>
                    <span className="hours">{review.horasJugadas}h</span>
                    <span 
                      className="difficulty"
                      style={{ color: getDifficultyColor(review.dificultad) }}
                    >
                      {review.dificultad}
                    </span>
                    <span className={`recommendation ${review.recomendaria ? 'yes' : 'no'}`}>
                      {review.recomendaria ? '👍' : '👎'}
                    </span>
                  </div>
                  <p className="review-preview">
                    {review.textoReseña.substring(0, 100)}...
                  </p>
                </div>
                <Link 
                  to={`/reseñas/editar/${review._id}`}
                  className="btn btn-secondary"
                >
                  Ver
                </Link>
              </div>
            ))}
          </div>
          
          {reviews.length > 5 && (
            <div className="view-all-container">
              <Link to="/reseñas" className="btn btn-primary">
                Ver Todas las Reseñas ({reviews.length})
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Insights y Logros */}
      <div className="insights-section">
        <h3>🏆 Tus Insights</h3>
        <div className="insights-grid">
          {stats.totalReseñas >= 10 && (
            <div className="insight-card achievement">
              <div className="insight-icon">🎯</div>
              <div className="insight-content">
                <h4>Crítico Experimentado</h4>
                <p>¡Has escrito {stats.totalReseñas} reseñas! Eres un crítico confiable.</p>
              </div>
            </div>
          )}
          
          {stats.promedioPuntuacion >= 4 && (
            <div className="insight-card positive">
              <div className="insight-icon">😊</div>
              <div className="insight-content">
                <h4>Optimista Gaming</h4>
                <p>Tu puntuación promedio es {stats.promedioPuntuacion.toFixed(1)}. Disfrutas la mayoría de juegos.</p>
              </div>
            </div>
          )}
          
          {stats.promedioHorasJugadas >= 50 && (
            <div className="insight-card dedicated">
              <div className="insight-icon">💪</div>
              <div className="insight-content">
                <h4>Jugador Dedicado</h4>
                <p>Promedias {stats.promedioHorasJugadas.toFixed(0)} horas por juego. ¡Eso es dedicación!</p>
              </div>
            </div>
          )}
          
          {stats.porcentajeRecomendacion >= 80 && (
            <div className="insight-card generous">
              <div className="insight-icon">🤝</div>
              <div className="insight-content">
                <h4>Recomendador Generoso</h4>
                <p>Recomiendas el {stats.porcentajeRecomendacion}% de los juegos. ¡Eres muy positivo!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalStats;
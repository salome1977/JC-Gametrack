import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reviewService } from '../services/reviewService';
import './ReviewList.css';

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const response = await reviewService.getAllReviews();
      setReviews(response.data);
    } catch (err) {
      setError('Error al cargar las reseñas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
      try {
        await reviewService.deleteReview(id);
        setReviews(reviews.filter(review => review._id !== id));
      } catch (err) {
        setError('Error al eliminar la reseña');
        console.error(err);
      }
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`star ${index < rating ? 'filled' : ''}`}>
        ⭐
      </span>
    ));
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
        <div className="loading">Cargando reseñas...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>📝 Mis Reseñas</h1>
        <Link to="/reseñas/estadisticas" className="btn btn-primary">
          📊 Ver Estadísticas
        </Link>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="empty-state">
          <h3>No tienes reseñas escritas</h3>
          <p>Comienza escribiendo tu primera reseña desde la página de un juego</p>
          <Link to="/" className="btn btn-primary">
            Ir a Mi Biblioteca
          </Link>
        </div>
      ) : (
        <div className="reviews-grid">
          {reviews.map(review => (
            <div key={review._id} className="review-card">
              <div className="review-header">
                <div className="game-info">
                  <div 
                    className="game-image"
                    style={{ 
                      backgroundImage: review.juegoId.coverImageUrl ? 
                        `url(${review.juegoId.coverImageUrl})` : 
                        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    }}
                  >
                    {!review.juegoId.coverImageUrl && <span>🎮</span>}
                  </div>
                  <div className="game-details">
                    <h3>{review.juegoId.title}</h3>
                    <p>{review.juegoId.platform}</p>
                  </div>
                </div>
                <div className="review-actions">
                  <Link 
                    to={`/reseñas/editar/${review._id}`}
                    className="btn btn-secondary"
                  >
                    Editar
                  </Link>
                  <button 
                    onClick={() => handleDelete(review._id)}
                    className="btn btn-danger"
                  >
                    Eliminar
                  </button>
                </div>
              </div>

              <div className="review-stats">
                <div className="rating">
                  {renderStars(review.puntuacion)}
                  <span>({review.puntuacion}/5)</span>
                </div>
                <span 
                  className="difficulty-badge"
                  style={{ backgroundColor: getDifficultyColor(review.dificultad) }}
                >
                  {review.dificultad}
                </span>
                <span className="hours">{review.horasJugadas}h jugadas</span>
                <span className={`recommendation ${review.recomendaria ? 'yes' : 'no'}`}>
                  {review.recomendaria ? '👍 Recomendado' : '👎 No recomendado'}
                </span>
              </div>

              <div className="review-content">
                <p>{review.textoReseña}</p>
              </div>

              <div className="review-footer">
                <small>
                  Creada: {new Date(review.fechaCreacion).toLocaleDateString('es-ES')}
                  {review.fechaActualizacion > review.fechaCreacion && (
                    ` • Actualizada: ${new Date(review.fechaActualizacion).toLocaleDateString('es-ES')}`
                  )}
                </small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
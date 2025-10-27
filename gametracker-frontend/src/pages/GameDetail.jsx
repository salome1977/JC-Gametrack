import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { gameService } from '../services/api';
import './GameDetail.css';

const GameDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { //Que dedo devolver aqui?
    loadGame();
  }, [id]);

  const loadGame = async () => {
    try {
      const response = await gameService.getGame(id);
      setGame(response.data);
    } catch (err) {
      setError('Error al cargar el juego');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este juego?')) {
      try {
        await gameService.deleteGame(id);
        navigate('/');
      } catch (err) {
        setError('Error al eliminar el juego');
        console.error(err);
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Completed': '#10b981',
      'Playing': '#3b82f6',
      'Not Started': '#6b7280',
      'On Hold': '#f59e0b',
      'Dropped': '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`star ${index < rating ? 'filled' : ''}`}
      >
        ⭐
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Cargando juego...</div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="container">
        <div className="error-message">
          {error || 'Juego no encontrado'}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="game-detail">
        <div className="detail-header">
          <button 
            onClick={() => navigate(-1)}
            className="btn btn-secondary"
          >
            ← Volver
          </button>
          <div className="header-actions">
            <Link to={`/edit-game/${game._id}`} className="btn btn-primary">
              Editar
            </Link>
            <button onClick={handleDelete} className="btn btn-danger">
              Eliminar
            </button>
          </div>
        </div>

        <div className="detail-content">
          <div className="game-hero">
            <div 
              className="hero-image"
              style={{ 
                backgroundImage: game.imageUrl ? `url(${game.imageUrl})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              {!game.imageUrl && <span>🎮</span>}
            </div>
            
            <div className="hero-info">
              <h1>{game.title}</h1>
              
              <div className="meta-info">
                <div className="meta-item">
                  <strong>Plataforma:</strong>
                  <span>{game.platform}</span>
                </div>
                <div className="meta-item">
                  <strong>Género:</strong>
                  <span>{game.genre}</span>
                </div>
                <div className="meta-item">
                  <strong>Estado:</strong>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(game.status) }}
                  >
                    {game.status}
                  </span>
                </div>
                {game.hoursPlayed > 0 && (
                  <div className="meta-item">
                    <strong>Horas Jugadas:</strong>
                    <span>{game.hoursPlayed}h</span>
                  </div>
                )}
                {game.completionDate && (
                  <div className="meta-item">
                    <strong>Completado:</strong>
                    <span>{new Date(game.completionDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {game.rating > 0 && (
                <div className="rating-section">
                  <strong>Calificación:</strong>
                  <div className="rating-stars">
                    {renderStars(game.rating)}
                  </div>
                </div>
              )}

              {game.tags && game.tags.length > 0 && (
                <div className="tags-section">
                  <strong>Etiquetas:</strong>
                  <div className="tags">
                    {game.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {game.review && (
            <div className="review-section">
              <h2>Mi Reseña</h2>
              <div className="review-content">
                {game.review.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameDetail;
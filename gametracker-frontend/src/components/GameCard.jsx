import React from 'react';
import { Link } from 'react-router-dom';
import './GameCard.css';

const GameCard = ({ game, onDelete }) => {
  // Función para formatear la fecha
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
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

  const getStatusText = (completed) => {
    return completed ? 'Completado' : 'No Completado';
  };

  const getStatusColor = (completed) => {
    return completed ? '#10b981' : '#6b7280';
  };

  return (
    <div className="game-card">
      <div 
        className="game-image"
        style={{ 
          backgroundImage: game.coverImageUrl ? `url(${game.coverImageUrl})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        {!game.coverImageUrl && <span>🎮</span>}
      </div>
      
      <div className="game-content">
        <div className="game-header">
          <h3 className="game-title">{game.title}</h3>
          <span 
            className="status-badge"
            style={{ backgroundColor: getStatusColor(game.completed) }}
          >
            {getStatusText(game.completed)}
          </span>
        </div>
        
        <div className="game-info">
          <span className="platform">{game.platform}</span>
          <span className="genre">{game.genre}</span>
          {game.releaseDate && (
            <span className="release-date">{formatDate(game.releaseDate)}</span>
          )}
        </div>
        
        <div className="game-stats">
          <div className="rating">
            {renderStars(game.averageRating)}
            <span className="rating-text">({game.averageRating}/5)</span>
          </div>
          {game.hoursPlayed > 0 && (
            <span className="hours">{game.hoursPlayed}h jugadas</span>
          )}
          {game.totalReviews > 0 && (
            <span className="reviews">{game.totalReviews} reseñas</span>
          )}
        </div>

        {game.developer && (
          <div className="game-developer">
            <strong>Desarrollador:</strong> {game.developer}
          </div>
        )}

        {game.publisher && (
          <div className="game-publisher">
            <strong>Publicador:</strong> {game.publisher}
          </div>
        )}
        
        {game.description && (
          <p className="description-preview">
            {game.description.substring(0, 120)}...
          </p>
        )}
        
        <div className="game-actions">
          <Link to={`/game/${game._id}`} className="btn btn-primary">
            Ver Detalles
          </Link>
          <Link to={`/edit-game/${game._id}`} className="btn btn-secondary">
            Editar
          </Link>
          <button 
            onClick={() => onDelete(game._id)}
            className="btn btn-danger"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
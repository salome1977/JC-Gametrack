import React from 'react';
import { Link } from 'react-router-dom';
import './GameCard.css';

const GameCard = ({ game, onDelete }) => {
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

  return (
    <div className="game-card">
      <div 
        className="game-image"
        style={{ 
          backgroundImage: game.imageUrl ? `url(${game.imageUrl})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        {!game.imageUrl && <span>🎮</span>}
      </div>
      
      <div className="game-content">
        <div className="game-header">
          <h3 className="game-title">{game.title}</h3>
          <span 
            className="status-badge"
            style={{ backgroundColor: getStatusColor(game.status) }}
          >
            {game.status}
          </span>
        </div>
        
        <div className="game-info">
          <span className="platform">{game.platform}</span>
          <span className="genre">{game.genre}</span>
        </div>
        
        <div className="game-stats">
          <div className="rating">
            {renderStars(game.rating)}
          </div>
          {game.hoursPlayed > 0 && (
            <span className="hours">{game.hoursPlayed}h</span>
          )}
        </div>
        
        {game.review && (
          <p className="review-preview">
            {game.review.substring(0, 100)}...
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
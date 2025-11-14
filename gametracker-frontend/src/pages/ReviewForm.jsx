import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { reviewService, gameService } from '../services/api';
import './ReviewForm.css';

const ReviewForm = () => {
  const { id } = useParams(); // ID de la reseña (para edición)
  const { state } = useLocation(); // Datos del juego desde navegación
  const navigate = useNavigate();
  
  const isEditing = Boolean(id);
  const [juego, setJuego] = useState(state?.juego || null);
  const [games, setGames] = useState([]);
  
  const [formData, setFormData] = useState({
    juegoId: state?.juego?._id || '', // ← Inicializar con el juego de state si existe
    puntuacion: 5,
    textoReseña: '',
    horasJugadas: 0,
    dificultad: 'Normal',
    recomendaria: true
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isEditing) {
      loadReview();
    } else {
      loadGames();
    }
    
    // Si viene con juego desde la navegación, establecerlo
    if (state?.juego && !formData.juegoId) {
      setFormData(prev => ({ ...prev, juegoId: state.juego._id }));
    }
  }, [id, isEditing, state]);

  const loadReview = async () => {
    try {
      const response = await reviewService.getAllReviews();
      const review = response.data.find(r => r._id === id);
      
      if (review) {
        setFormData({
          juegoId: review.juegoId._id,
          puntuacion: review.puntuacion,
          textoReseña: review.textoReseña,
          horasJugadas: review.horasJugadas,
          dificultad: review.dificultad,
          recomendaria: review.recomendaria
        });
        setJuego(review.juegoId);
      }
    } catch (err) {
      setError('Error al cargar la reseña');
      console.error(err);
    }
  };

  const loadGames = async () => {
    try {
      const response = await gameService.getAllGames();
      setGames(response.data);
    } catch (err) {
      console.error('Error cargando juegos:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleGameSelect = (game) => {
    setJuego(game);
    setFormData(prev => ({ ...prev, juegoId: game._id }));
    setSearchTerm(game.title);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.juegoId) {
      setError('Debes seleccionar un juego');
      return;
    }
    
    if (!formData.textoReseña.trim()) {
      setError('La reseña no puede estar vacía');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isEditing) {
        await reviewService.updateReview(id, formData);
      } else {
        await reviewService.createReview(formData);
      }
      
      navigate('/reseñas');
    } catch (err) {
      console.error('Error guardando reseña:', err);
      
      if (err.response?.data?.message === 'Ya existe una reseña para este juego') {
        setError('Ya tienes una reseña para este juego. Puedes editarla desde la lista de reseñas.');
      } else {
        setError('Error al guardar la reseña: ' + (err.response?.data?.message || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (currentRating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <button
        key={index}
        type="button"
        className={`star-btn ${index < currentRating ? 'filled' : ''}`}
        onClick={() => setFormData(prev => ({ ...prev, puntuacion: index + 1 }))}
        disabled={loading}
      >
        ⭐
      </button>
    ));
  };

  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <div className="form-container">
        <h1>{isEditing ? '✏️ Editar Reseña' : '📝 Escribir Nueva Reseña'}</h1>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="review-form">
          {/* Selección de Juego */}
          <div className="form-group">
            <label htmlFor="gameSearch">Seleccionar Juego *</label>
            
            {juego ? (
              <div className="selected-game">
                <div 
                  className="game-image"
                  style={{ 
                    backgroundImage: juego.coverImageUrl ? 
                      `url(${juego.coverImageUrl})` : 
                      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}
                >
                  {!juego.coverImageUrl && <span>🎮</span>}
                </div>
                <div className="game-info">
                  <h4>{juego.title}</h4>
                  <p>{juego.platform}</p>
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    setJuego(null);
                    setFormData(prev => ({ ...prev, juegoId: '' }));
                    setSearchTerm('');
                  }}
                  className="btn btn-secondary"
                >
                  Cambiar
                </button>
              </div>
            ) : (
              <>
                <input
                  type="text"
                  id="gameSearch"
                  placeholder="Buscar juego..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={loading}
                />
                
                {searchTerm && filteredGames.length > 0 && (
                  <div className="games-dropdown">
                    {filteredGames.map(game => (
                      <div
                        key={game._id}
                        className="game-option"
                        onClick={() => handleGameSelect(game)}
                      >
                        <div 
                          className="game-option-image"
                          style={{ 
                            backgroundImage: game.coverImageUrl ? 
                              `url(${game.coverImageUrl})` : 
                              'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                          }}
                        />
                        <div className="game-option-info">
                          <strong>{game.title}</strong>
                          <span>{game.platform}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Puntuación con Estrellas */}
          <div className="form-group">
            <label>Puntuación *</label>
            <div className="star-rating">
              {renderStars(formData.puntuacion)}
              <span className="rating-text">({formData.puntuacion}/5)</span>
            </div>
          </div>

          {/* Horas Jugadas y Dificultad */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="horasJugadas">Horas Jugadas *</label>
              <input
                type="number"
                id="horasJugadas"
                name="horasJugadas"
                value={formData.horasJugadas}
                onChange={handleChange}
                min="0"
                step="0.1"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="dificultad">Dificultad *</label>
              <select
                id="dificultad"
                name="dificultad"
                value={formData.dificultad}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="Fácil">Fácil</option>
                <option value="Normal">Normal</option>
                <option value="Difícil">Difícil</option>
              </select>
            </div>
          </div>

          {/* Recomendar */}
          <div className="form-group">
            <label htmlFor="recomendaria" className="checkbox-label">
              <input
                type="checkbox"
                id="recomendaria"
                name="recomendaria"
                checked={formData.recomendaria}
                onChange={handleChange}
                disabled={loading}
              />
              <span className="checkmark"></span>
              ¿Recomendarías este juego?
            </label>
          </div>

          {/* Texto de la Reseña */}
          <div className="form-group">
            <label htmlFor="textoReseña">Reseña *</label>
            <textarea
              id="textoReseña"
              name="textoReseña"
              value={formData.textoReseña}
              onChange={handleChange}
              rows="8"
              placeholder="Escribe tu reseña detallada... ¿Qué te gustó? ¿Qué no te gustó? ¿Recomendarías el juego?"
              required
              disabled={loading}
              maxLength="2000"
            />
            <div className="char-count">
              {formData.textoReseña.length}/2000 caracteres
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(isEditing ? '/reseñas' : '/')}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !formData.juegoId}
              className="btn btn-primary"
            >
              {loading ? 'Guardando...' : (isEditing ? 'Actualizar Reseña' : 'Publicar Reseña')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gameService } from '../services/api';
import './GameForm.css';

const GameForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    platform: 'PC',
    releaseDate: '',
    developer: '',
    publisher: '',
    description: '',
    coverImageUrl: '',
    averageRating: 0,
    totalReviews: 0,
    hoursPlayed: 0,
    completed: false
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      loadGame();
    }
  }, [id]);

  const loadGame = async () => {
    try {
      const response = await gameService.getGame(id);
      const game = response.data;
      setFormData({
        ...game,
        releaseDate: game.releaseDate ? new Date(game.releaseDate).toISOString().split('T')[0] : '',
      });
    } catch (err) {
      setError('Error al cargar el juego');
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? 0 : parseFloat(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validación más específica
    const requiredFields = {
      title: 'Título',
      genre: 'Género', 
      developer: 'Desarrollador',
      publisher: 'Publicador',
      description: 'Descripción',
      coverImageUrl: 'URL de portada',
      releaseDate: 'Fecha de lanzamiento'
    };

    const missingFields = Object.entries(requiredFields)
  .filter(([field, label]) => !formData[field]?.toString().trim())
  .map(([field, label]) => label);

    if (missingFields.length > 0) {
      setError(`Los siguientes campos son obligatorios: ${missingFields.join(', ')}`);
      setLoading(false);
      return;
    }

    try {
      const submitData = {
        title: formData.title.trim(),
        genre: formData.genre.trim(),
        platform: formData.platform,
        releaseDate: formData.releaseDate,
        developer: formData.developer.trim(),
        publisher: formData.publisher.trim(),
        description: formData.description.trim(),
        coverImageUrl: formData.coverImageUrl.trim(),
        averageRating: parseFloat(formData.averageRating) || 0,
        totalReviews: parseInt(formData.totalReviews) || 0,
        hoursPlayed: parseFloat(formData.hoursPlayed) || 0,
        completed: Boolean(formData.completed)
      };

      console.log('🎯 Enviando datos:', submitData);

      if (isEditing) {
        await gameService.updateGame(id, submitData);
      } else {
        await gameService.createGame(submitData);
      }
      
      navigate('/');
    } catch (err) {
      console.error('❌ Error completo:', err.response?.data || err);
      setError('Error al guardar el juego: ' + (err.response?.data?.message || err.message));
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
        onClick={() => setFormData(prev => ({ ...prev, averageRating: index + 1 }))}
        disabled={loading}
      >
        ⭐
      </button>
    ));
  };

  return (
    <div className="container">
      <div className="form-container">
        <h1>{isEditing ? 'Editar Juego' : 'Agregar Nuevo Juego'}</h1>
        
        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="game-form">
          {/* Título y Género */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Título del Juego *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="The Legend of Zelda: Breath of the Wild"
              />
            </div>

            <div className="form-group">
              <label htmlFor="genre">Género *</label>
              <input
                type="text"
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Aventura, RPG"
              />
            </div>
          </div>

          {/* Plataforma y Fecha de Lanzamiento */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="platform">Plataforma *</label>
              <select
                id="platform"
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="PC">PC</option>
                <option value="PlayStation">PlayStation</option>
                <option value="Xbox">Xbox</option>
                <option value="Nintendo Switch">Nintendo Switch</option>
                <option value="Mobile">Mobile</option>
                <option value="Other">Otra</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="releaseDate">Fecha de Lanzamiento *</label>
              <input
                type="date"
                id="releaseDate"
                name="releaseDate"
                value={formData.releaseDate}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Desarrollador y Publicador */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="developer">Desarrollador *</label>
              <input
                type="text"
                id="developer"
                name="developer"
                value={formData.developer}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Nintendo EPD"
              />
            </div>

            <div className="form-group">
              <label htmlFor="publisher">Publicador *</label>
              <input
                type="text"
                id="publisher"
                name="publisher"
                value={formData.publisher}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Nintendo"
              />
            </div>
          </div>

          {/* URL de Imagen */}
          <div className="form-group">
            <label htmlFor="coverImageUrl">URL de la Portada *</label>
            <input
              type="url"
              id="coverImageUrl"
              name="coverImageUrl"
              value={formData.coverImageUrl}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="https://example.com/game-cover.jpg"
            />
            <small style={{color: '#666', marginTop: '5px'}}>
              Ejemplo: https://images.igdb.com/igdb/image/upload/t_cover_big/co2r2f.jpg
            </small>
          </div>

          {/* Calificación */}
          <div className="form-group">
            <label>Calificación Promedio (0-5)</label>
            <div className="star-rating">
              {renderStars(formData.averageRating)}
              <span style={{marginLeft: '10px', color: '#666'}}>
                ({formData.averageRating}/5)
              </span>
            </div>
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={formData.averageRating}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                averageRating: Math.min(5, Math.max(0, parseFloat(e.target.value) || 0))
              }))}
              disabled={loading}
              style={{marginTop: '5px', width: '80px', padding: '5px'}}
            />
          </div>

          {/* Estadísticas */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="totalReviews">Total de Reseñas</label>
              <input
                type="number"
                id="totalReviews"
                name="totalReviews"
                value={formData.totalReviews}
                onChange={handleNumberChange}
                min="0"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="hoursPlayed">Horas Jugadas</label>
              <input
                type="number"
                id="hoursPlayed"
                name="hoursPlayed"
                value={formData.hoursPlayed}
                onChange={handleNumberChange}
                min="0"
                step="0.1"
                disabled={loading}
              />
            </div>
          </div>

          {/* Checkbox Completado */}
          <div className="form-group">
            <label htmlFor="completed" className="checkbox-label">
              <input
                type="checkbox"
                id="completed"
                name="completed"
                checked={formData.completed}
                onChange={handleChange}
                disabled={loading}
              />
              <span className="checkmark"></span>
              ¿Juego Completado?
            </label>
          </div>

          {/* Descripción */}
          <div className="form-group">
            <label htmlFor="description">Descripción *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="6"
              required
              disabled={loading}
              placeholder="Describe el juego, su historia, características principales..."
            />
          </div>

          {/* Botones de acción */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Agregar Juego')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GameForm;
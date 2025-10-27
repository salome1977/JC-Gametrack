import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gameService } from '../services/api';
import GameCard from '../components/GameCard';
import './GameList.css';

const GameList = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      setLoading(true);
      const response = await gameService.getAllGames();
      setGames(response.data);
    } catch (err) {
      setError('Error al cargar los juegos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este juego?')) {
      try {
        await gameService.deleteGame(id);
        setGames(games.filter(game => game._id !== id));
      } catch (err) {
        setError('Error al eliminar el juego');
        console.error(err);
      }
    }
  };

  const filteredGames = games.filter(game => {
    if (filter === 'all') return true;
    return game.status === filter;
  });

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Cargando juegos...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Mi Biblioteca de Juegos</h1>
        <Link to="/add-game" className="btn btn-primary">
          + Agregar Juego
        </Link>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Todos
        </button>
        <button 
          className={`filter-btn ${filter === 'Not Started' ? 'active' : ''}`}
          onClick={() => setFilter('Not Started')}
        >
          No Iniciados
        </button>
        <button 
          className={`filter-btn ${filter === 'Playing' ? 'active' : ''}`}
          onClick={() => setFilter('Playing')}
        >
          Jugando
        </button>
        <button 
          className={`filter-btn ${filter === 'Completed' ? 'active' : ''}`}
          onClick={() => setFilter('Completed')}
        >
          Completados
        </button>
        <button 
          className={`filter-btn ${filter === 'On Hold' ? 'active' : ''}`}
          onClick={() => setFilter('On Hold')}
        >
          En Pausa
        </button>
        <button 
          className={`filter-btn ${filter === 'Dropped' ? 'active' : ''}`}
          onClick={() => setFilter('Dropped')}
        >
          Abandonados
        </button>
      </div>

      {filteredGames.length === 0 ? (
        <div className="empty-state">
          <h3>No hay juegos en tu biblioteca</h3>
          <p>Comienza agregando tu primer juego</p>
          <Link to="/add-game" className="btn btn-primary">
            Agregar Primer Juego
          </Link>
        </div>
      ) : (
        <div className="games-grid">
          {filteredGames.map(game => (
            <GameCard 
              key={game._id} 
              game={game} 
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GameList;
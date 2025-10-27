import React, { useState, useEffect } from 'react';
import { statsService } from '../services/api';
import './Statistics.css';

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await statsService.getStats();
      setStats(response.data);
    } catch (err) {
      setError('Error al cargar las estadísticas');
      console.error(err);
    } finally {
      setLoading(false);
    }
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
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Estadísticas de Mi Biblioteca</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🎮</div>
          <div className="stat-value">{stats.totalGames}</div>
          <div className="stat-label">Juegos Totales</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{stats.completedGames}</div>
          <div className="stat-label">Juegos Completados</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-value">{stats.totalHours}</div>
          <div className="stat-label">Horas Totales</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-value">{stats.averageRating.toFixed(1)}</div>
          <div className="stat-label">Calificación Promedio</div>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-section">
          <h3>Juegos por Plataforma</h3>
          <div className="chart">
            {stats.gamesByPlatform.map(item => (
              <div key={item._id} className="chart-item">
                <div className="chart-label">{item._id}</div>
                <div className="chart-bar-container">
                  <div 
                    className="chart-bar"
                    style={{ 
                      width: `${(item.count / stats.totalGames) * 100}%` 
                    }}
                  >
                    <span className="chart-value">{item.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-section">
          <h3>Juegos por Estado</h3>
          <div className="chart">
            {stats.gamesByStatus.map(item => (
              <div key={item._id} className="chart-item">
                <div className="chart-label">{item._id}</div>
                <div className="chart-bar-container">
                  <div 
                    className="chart-bar"
                    style={{ 
                      width: `${(item.count / stats.totalGames) * 100}%` 
                    }}
                  >
                    <span className="chart-value">{item.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
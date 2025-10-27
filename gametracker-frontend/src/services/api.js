import axios from 'axios';

// ✅ SOLUCIÓN DIRECTA - Sin variables de entorno
const API_BASE_URL = 'http://localhost:5000/api';

console.log('🎮 GameTracker API URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    console.log(`🔄 ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url
    });
    
    if (error.response?.status === 404) {
      console.error('⚠️ Endpoint no encontrado');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('🔌 No se puede conectar al backend en:', API_BASE_URL);
      console.error('💡 Verifica que el backend esté corriendo en otro terminal');
    }
    
    return Promise.reject(error);
  }
);

export const gameService = {
  getAllGames: () => api.get('/games'),
  getGame: (id) => api.get(`/games/${id}`),
  createGame: (gameData) => api.post('/games', gameData),
  updateGame: (id, gameData) => api.put(`/games/${id}`, gameData),
  deleteGame: (id) => api.delete(`/games/${id}`),
};

export const statsService = {
  getStats: () => api.get('/stats'),
};

export default api;
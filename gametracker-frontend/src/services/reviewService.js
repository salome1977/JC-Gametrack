import api from './api';

export const reviewService = {
  // Obtener todas las reseñas
  getAllReviews: () => api.get('/reseñas'),
  
  // Obtener reseñas de un juego específico
  getReviewsByGame: (juegoId) => api.get(`/reseñas/juego/${juegoId}`),
  
  // Crear nueva reseña
  createReview: (reviewData) => api.post('/reseñas', reviewData),
  
  // Actualizar reseña existente
  updateReview: (id, reviewData) => api.put(`/reseñas/${id}`, reviewData),
  
  // Eliminar reseña
  deleteReview: (id) => api.delete(`/reseñas/${id}`),
  
  // Obtener estadísticas personales
  getPersonalStats: () => api.get('/reseñas/estadisticas/personales')
};
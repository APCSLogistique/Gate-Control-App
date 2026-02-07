/**
 * API Routes Configuration
 * Configuration centrale pour la connexion avec le backend Laravel
 *
 * Backend: Backend/apcs-backend/routes/api.php
 * Base URL: http://localhost:8080/api
 */

import apiClient from '../services/api.client';

// Configuration de base
export const API_BASE = {
  URL: import.meta.env.VITE_API_URL ,
  TIMEOUT: 30000,
};

// Instance API principale
const api = {
  // Client HTTP
  client: apiClient,

  // Helpers pour construire les URLs
  url(path) {
    return path.startsWith('/') ? path : `/${path}`;
  },

  // Méthodes HTTP
  get: (path, params) => apiClient.get(api.url(path), params),
  post: (path, data) => apiClient.post(api.url(path), data),
  put: (path, data) => apiClient.put(api.url(path), data),
  delete: (path) => apiClient.delete(api.url(path)),
};

export default api;

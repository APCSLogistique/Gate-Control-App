/**
 * API Client
 * Client HTTP centralisé avec gestion des tokens et erreurs
 */

import { API_CONFIG } from '../config/api.config';

class ApiClient {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  /**
   * Récupère le token d'authentification
   */
  getAuthToken() {
    return localStorage.getItem(API_CONFIG.STORAGE_KEYS.TOKEN);
  }

  /**
   * Récupère les headers avec authentification
   */
  getHeaders(customHeaders = {}) {
    const headers = {
      ...API_CONFIG.HEADERS,
      ...customHeaders,
    };

    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Gestion des erreurs API
   */
  handleError(error, response) {
    if (response) {
      switch (response.status) {
        case 401:
          // Token expiré ou invalide
          localStorage.removeItem(API_CONFIG.STORAGE_KEYS.TOKEN);
          localStorage.removeItem(API_CONFIG.STORAGE_KEYS.USER);
          window.location.href = '/login';
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        case 403:
          throw new Error('Accès non autorisé.');
        case 404:
          throw new Error('Ressource non trouvée.');
        case 422:
          throw new Error('Données invalides.');
        case 500:
          throw new Error('Erreur serveur. Veuillez réessayer.');
        default:
          throw new Error(error.message || 'Une erreur est survenue.');
      }
    }
    throw new Error('Erreur de connexion au serveur.');
  }

  /**
   * Requête générique
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      method: options.method || 'GET',
      headers: this.getHeaders(options.headers),
      ...options,
    };

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        this.handleError(data, response);
      }

      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('La requête a expiré. Veuillez réessayer.');
      }
      throw error;
    }
  }

  /**
   * GET Request
   */
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  /**
   * POST Request
   */
  async post(endpoint, body = {}) {
    return this.request(endpoint, { method: 'POST', body });
  }

  /**
   * PUT Request
   */
  async put(endpoint, body = {}) {
    return this.request(endpoint, { method: 'PUT', body });
  }

  /**
   * DELETE Request
   */
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Instance singleton
const apiClient = new ApiClient();

export default apiClient;

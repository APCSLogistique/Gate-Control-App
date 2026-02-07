/**
 * Auth Service
 * Utilise les routes définies dans src/routes/auth.routes.js
 */

import { authRoutes } from '../routes/auth.routes';
import { API_CONFIG } from '../config/api.config';

// Comptes de démonstration
const DEMO_ACCOUNTS = {
  'admin@apcs.dz': {
    email: 'admin@apcs.dz',
    password: 'admin123',
    role: 'admin',
    name: 'Admin Demo',
    id: 'demo-admin-001'
  },
  'operator@apcs.dz': {
    email: 'operator@apcs.dz',
    password: 'operator123',
    role: 'operator',
    name: 'Operator Demo',
    id: 'demo-operator-001'
  },
  'carrier@apcs.dz': {
    email: 'carrier@apcs.dz',
    password: 'carrier123',
    role: 'carrier',
    name: 'Carrier Demo',
    id: 'demo-carrier-001'
  }
};

export const authService = {
  /**
   * Inscription d'un nouvel utilisateur
   */
  async register(userData) {
    return authRoutes.register(userData);
  },

  /**
   * Connexion de l'utilisateur
   */
  async login(email, password) {
    // Vérifier si c'est un compte de démonstration
    const demoAccount = DEMO_ACCOUNTS[email];

    if (demoAccount && demoAccount.password === password) {
      // Connexion directe pour les comptes de démo
      const demoUser = {
        id: demoAccount.id,
        email: demoAccount.email,
        name: demoAccount.name,
        role: demoAccount.role
      };

      const demoToken = `demo-token-${demoAccount.role}-${Date.now()}`;

      // Stocker le token et les données utilisateur
      localStorage.setItem(API_CONFIG.STORAGE_KEYS.TOKEN, demoToken);
      localStorage.setItem(API_CONFIG.STORAGE_KEYS.USER, JSON.stringify(demoUser));

      return {
        token: demoToken,
        user: demoUser
      };
    }

    // Si ce n'est pas un compte de démo, utiliser l'API
    const response = await authRoutes.login(email, password);

    // Stocker le token et les données utilisateur
    if (response.token) {
      localStorage.setItem(API_CONFIG.STORAGE_KEYS.TOKEN, response.token);
    }
    if (response.user) {
      localStorage.setItem(API_CONFIG.STORAGE_KEYS.USER, JSON.stringify(response.user));
    }

    return response;
  },

  /**
   * Déconnexion de l'utilisateur
   */
  async logout() {
    try {
      await authRoutes.logout();
    } catch (error) {
      // Ignorer les erreurs de déconnexion
    } finally {
      localStorage.removeItem(API_CONFIG.STORAGE_KEYS.TOKEN);
      localStorage.removeItem(API_CONFIG.STORAGE_KEYS.USER);
    }
  },

  /**
   * Récupère l'utilisateur depuis le stockage local
   */
  getCurrentUser() {
    const userData = localStorage.getItem(API_CONFIG.STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  },

  /**
   * Vérifie si l'utilisateur est authentifié
   */
  isAuthenticated() {
    return !!localStorage.getItem(API_CONFIG.STORAGE_KEYS.TOKEN);
  },

  /**
   * Récupère le token
   */
  getToken() {
    return localStorage.getItem(API_CONFIG.STORAGE_KEYS.TOKEN);
  },
};

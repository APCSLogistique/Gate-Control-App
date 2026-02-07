/**
 * Authentication Routes
 * Liaison avec: Backend/apcs-backend/routes/api.php (lignes 17-18)
 *
 * Routes Backend:
 * - POST /register → UserController::Register
 * - POST /login → UserController::login
 */

import api from './api.routes';

export const authRoutes = {
  /**
   * POST /register
   * Inscription d'un nouvel utilisateur
   *
   * Backend: Route::post('/register', [UserController::class, 'Register']);
   *
   * @param {Object} userData
   * @param {string} userData.name - Nom de l'utilisateur
   * @param {string} userData.email - Email
   * @param {string} userData.password - Mot de passe
   * @param {string} userData.role - Rôle (admin, operator, transiter)
   * @returns {Promise<Object>} { message, user }
   */
  register(userData) {
    return api.post('/register', userData);
  },

  /**
   * POST /login
   * Connexion d'un utilisateur
   *
   * Backend: Route::post('/login', [UserController::class, 'login']);
   *
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe
   * @returns {Promise<Object>} { message, user, token }
   */
  login(email, password) {
    return api.post('/login', { email, password });
  },

  /**
   * POST /logout
   * Déconnexion de l'utilisateur
   *
   * Backend: Géré par Sanctum
   *
   * @returns {Promise<void>}
   */
  logout() {
    return api.post('/logout');
  },
};

export default authRoutes;

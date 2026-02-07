/**
 * User Routes
 * Liaison avec: Backend/apcs-backend/routes/api.php (lignes 20-25)
 *
 * Routes Backend (auth:sanctum):
 * - GET /user/profile → UserController::getProfile
 * - GET /user/bookings → UserController::getUserBookings
 */

import api from './api.routes';

export const userRoutes = {
  /**
   * GET /user/profile
   * Récupère le profil de l'utilisateur connecté
   *
   * Backend: Route::get('/profile', [UserController::class, 'getProfile']);
   * Middleware: auth:sanctum
   * Roles: Tous
   *
   * @returns {Promise<Object>} { user_id, name, email, role }
   */
  getProfile() {
    return api.get('/user/profile');
  },

  /**
   * GET /user/bookings
   * Récupère toutes les réservations de l'utilisateur
   *
   * Backend: Route::get('/bookings', [UserController::class, 'getUserBookings']);
   * Middleware: auth:sanctum
   * Roles: Tous (carrier voit ses bookings, admin voit tous)
   *
   * @returns {Promise<Array>} Liste des réservations
   * @returns {string} [].booking_id - ID de la réservation
   * @returns {string} [].truck_number - Numéro du camion
   * @returns {Object} [].timeslot - Créneau horaire
   * @returns {string} [].timeslot.date - Date (YYYY-MM-DD)
   * @returns {string} [].timeslot.hour_start - Heure de début
   * @returns {string} [].status - Status (pending, in, out)
   * @returns {string} [].created_at - Date de création
   */
  getUserBookings() {
    return api.get('/user/bookings');
  },

  /**
   * PUT /user/profile
   * Met à jour le profil de l'utilisateur
   *
   * Note: Cette route n'existe pas encore dans le backend
   * À implémenter si nécessaire
   *
   * @param {Object} profileData - Nouvelles données du profil
   * @returns {Promise<Object>} Profil mis à jour
   */
  updateProfile(profileData) {
    return api.put('/user/profile', profileData);
  },
};

export default userRoutes;

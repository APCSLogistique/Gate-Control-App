/**
 * User Service
 * Utilise les routes définies dans src/routes/user.routes.js
 */

import { userRoutes } from '../routes/user.routes';

export const userService = {
  /**
   * Récupère le profil de l'utilisateur connecté
   */
  async getProfile() {
    return userRoutes.getProfile();
  },

  /**
   * Récupère toutes les réservations de l'utilisateur
   */
  async getUserBookings() {
    return userRoutes.getUserBookings();
  },

  /**
   * Met à jour le profil utilisateur
   */
  async updateProfile(profileData) {
    return userRoutes.updateProfile(profileData);
  },
};

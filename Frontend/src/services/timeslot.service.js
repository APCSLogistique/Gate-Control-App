/**
 * TimeSlot Service
 * Utilise les routes définies dans src/routes/timeslot.routes.js
 */

import { timeslotRoutes } from '../routes/timeslot.routes';

export const timeslotService = {
  /**
   * Récupère la disponibilité d'un créneau horaire
   */
  async getAvailability(date, hour) {
    return timeslotRoutes.getAvailability(date, hour);
  },

  /**
   * Alias pour compatibilité
   */
  async getTimeSlotAvailability(date, hour) {
    return this.getAvailability(date, hour);
  },

  /**
   * Vérifie si un slot est disponible
   */
  async isAvailable(date, hour) {
    return timeslotRoutes.isAvailable(date, hour);
  },

  /**
   * Obtient le nombre de places restantes
   */
  async getRemainingCapacity(date, hour) {
    return timeslotRoutes.getRemainingCapacity(date, hour);
  },
};

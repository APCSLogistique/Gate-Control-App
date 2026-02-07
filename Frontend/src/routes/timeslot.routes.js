/**
 * TimeSlot Routes
 * Liaison avec: Backend/apcs-backend/routes/api.php (lignes 38-40)
 *
 * Routes Backend (timeslot prefix, pas de auth):
 * - GET /timeslot/{date}/{hour} → TimeslotController::getTimeslotAvailability
 */

import api from './api.routes';

export const timeslotRoutes = {
  /**
   * GET /timeslot/{date}/{hour}
   * Récupère la disponibilité d'un créneau horaire
   *
   * Backend: Route::get('/{date}/{hour}', [TimeslotController::class, 'getTimeslotAvailability']);
   * Middleware: Aucun (public)
   * Roles: Tous (même non authentifié)
   * Controller: Backend/apcs-backend/app/Http/Controllers/TimeslotController.php (ligne 12)
   *
   * Logique Backend:
   * 1. Récupère la config de capacité globale
   * 2. Trouve le timeslot pour date/heure
   * 3. Si pas de timeslot: retourne la config par défaut avec used_capacity=0
   * 4. Si timeslot existe: compte les bookings actifs (pending, in)
   * 5. Retourne max_capacity, used_capacity, late_capacity
   *
   * Utilisation:
   * - Afficher la disponibilité avant de créer un booking
   * - Vérifier si un slot est disponible
   * - Afficher le taux d'occupation
   *
   * @param {string} date - Date au format YYYY-MM-DD
   * @param {string} hour - Heure au format HH:00
   * @returns {Promise<Object>} Disponibilité du créneau
   * @returns {number} max_capacity - Capacité maximale du slot
   * @returns {number} used_capacity - Nombre de places utilisées (bookings actifs)
   * @returns {number} late_capacity - Capacité pour arrivées en retard
   *
   * @example
   * // Vérifier disponibilité pour le 2026-02-10 à 08:00
   * const availability = await timeslotRoutes.getAvailability('2026-02-10', '08:00');
   * console.log(`Disponible: ${availability.max_capacity - availability.used_capacity} places`);
   * console.log(`Late capacity: ${availability.late_capacity} places`);
   */
  getAvailability(date, hour) {
    return api.get(`/timeslot/${date}/${hour}`);
  },

  /**
   * Helper: Vérifie si un slot est disponible
   * @param {string} date - Date au format YYYY-MM-DD
   * @param {string} hour - Heure au format HH:00
   * @returns {Promise<boolean>} true si le slot a de la place
   */
  async isAvailable(date, hour) {
    const availability = await this.getAvailability(date, hour);
    return availability.used_capacity < availability.max_capacity;
  },

  /**
   * Helper: Obtient le nombre de places restantes
   * @param {string} date - Date au format YYYY-MM-DD
   * @param {string} hour - Heure au format HH:00
   * @returns {Promise<number>} Nombre de places disponibles
   */
  async getRemainingCapacity(date, hour) {
    const availability = await this.getAvailability(date, hour);
    return availability.max_capacity - availability.used_capacity;
  },
};

export default timeslotRoutes;

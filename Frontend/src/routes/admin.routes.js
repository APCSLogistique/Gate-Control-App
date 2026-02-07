/**
 * Admin Routes
 * Liaison avec: Backend/apcs-backend/routes/api.php (lignes 50-69)
 *
 * Routes Backend (auth:sanctum + admin prefix):
 * - GET /admin/schedule → AdminController::getSchedule (Today)
 * - GET /admin/schedule/{date} → AdminController::getScheduleByDate
 * - GET /admin/schedule/{startDate}/{endDate} → AdminController::getSchedule
 * - GET /admin/data/logs/{startDate}/{endDate} → AdminController::getLogs
 * - GET /admin/data/schedule/{date} → AdminController::getScheduleByDate
 * - POST /admin/config/capacity → AdminController::updateCapacity
 *
 * Internal Tools (pour AI):
 * - POST /admin/internal/tools/booking-status
 * - POST /admin/internal/tools/user-bookings
 * - POST /admin/internal/tools/port-schedule
 * - POST /admin/internal/tools/available-slots
 */

import api from './api.routes';

export const adminRoutes = {
  // ==================== SCHEDULE ROUTES ====================

  /**
   * GET /admin/schedule
   * Récupère le planning d'aujourd'hui
   *
   * Backend: Route::get('/schedule', [AdminController::class, 'getSchedule']);
   * Middleware: auth:sanctum
   * Roles: Admin
   * Controller: Backend/apcs-backend/app/Http/Controllers/AdminController.php (ligne 14)
   *
   * @returns {Promise<Array>} Planning par date
   * @returns {string} [].date - Date
   * @returns {number} [].max_shipments - Capacité totale du jour
   * @returns {number} [].booked_amount - Nombre de bookings
   * @returns {Array} [].schedule - Détail par heure
   *
   * @example
   * const schedule = await adminRoutes.getTodaySchedule();
   * // [{ date: '2026-02-10', max_shipments: 120, booked_amount: 45, schedule: [...] }]
   */
  getTodaySchedule() {
    return api.get('/admin/schedule');
  },

  /**
   * GET /admin/schedule/{date}
   * Récupère le planning pour une date spécifique
   *
   * Backend: Route::get('/schedule/{date}', [AdminController::class, 'getScheduleByDate']);
   * Middleware: auth:sanctum
   * Roles: Admin
   *
   * @param {string} date - Date au format YYYY-MM-DD
   * @returns {Promise<Object>} Planning de la date
   */
  getScheduleByDate(date) {
    return api.get(`/admin/schedule/${date}`);
  },

  /**
   * GET /admin/schedule/{startDate}/{endDate}
   * Récupère le planning pour une plage de dates
   *
   * Backend: Route::get('/schedule/{startDate}/{endDate}', [AdminController::class, 'getSchedule']);
   * Middleware: auth:sanctum
   * Roles: Admin
   * Controller: Backend/apcs-backend/app/Http/Controllers/AdminController.php (ligne 14)
   *
   * Logique Backend:
   * 1. Récupère tous les timeslots entre les dates
   * 2. Pour chaque timeslot: compte les bookings actifs
   * 3. Groupe par date
   * 4. Calcule max_shipments et booked_amount par jour
   *
   * @param {string} startDate - Date de début (YYYY-MM-DD)
   * @param {string} endDate - Date de fin (YYYY-MM-DD)
   * @returns {Promise<Array>} Planning par date
   */
  getScheduleRange(startDate, endDate) {
    return api.get(`/admin/schedule/${startDate}/${endDate}`);
  },

  // ==================== DATA ROUTES ====================

  /**
   * GET /admin/data/schedule/{date}
   * Récupère les données du schedule pour une date
   *
   * Backend: Route::get('/data/schedule/{date}', [AdminController::class, 'getScheduleByDate']);
   * Alias de getScheduleByDate
   */
  getDataSchedule(date) {
    return api.get(`/admin/data/schedule/${date}`);
  },

  /**
   * GET /admin/data/logs/{startDate}/{endDate}
   * Récupère les logs système pour une plage de dates
   *
   * Backend: Route::get('/data/logs/{startDate}/{endDate}', [AdminController::class, 'getLogs']);
   * Middleware: auth:sanctum
   * Roles: Admin
   * Controller: Backend/apcs-backend/app/Http/Controllers/AdminController.php (ligne 62)
   *
   * Logique Backend:
   * 1. Récupère tous les logs entre les dates
   * 2. Groupe par date
   * 3. Retourne avec timestamp, code, message
   *
   * Codes de Log:
   * - NEW_BOOKING: Nouvelle réservation créée
   * - MODIFIED_BOOKING: Réservation modifiée
   * - DELETED_BOOKING: Réservation supprimée
   * - QR_GENERATED: QR code généré
   * - CARRIER_ARRIVED: Camion arrivé
   * - SHIPMENT_CONSUMED: Livraison terminée
   * - CONFIG_CHANGED: Configuration modifiée
   * - NEW_INCIDENT: Incident créé
   *
   * @param {string} startDate - Date de début (YYYY-MM-DD)
   * @param {string} endDate - Date de fin (YYYY-MM-DD)
   * @returns {Promise<Array>} Logs groupés par date
   * @returns {string} [].date - Date
   * @returns {Array} [].logs - Liste des logs du jour
   * @returns {string} [].logs[].timestamp - Timestamp
   * @returns {string} [].logs[].code - Code du log
   * @returns {string} [].logs[].message - Message
   */
  getLogs(startDate, endDate) {
    return api.get(`/admin/data/logs/${startDate}/${endDate}`);
  },

  // ==================== CONFIG ROUTES ====================

  /**
   * POST /admin/config/capacity
   * Met à jour la configuration de capacité du terminal
   *
   * Backend: Route::post('/config/capacity', [AdminController::class, 'updateCapacity']);
   * Middleware: auth:sanctum
   * Roles: Admin
   * Controller: Backend/apcs-backend/app/Http/Controllers/AdminController.php (ligne 90)
   *
   * Logique Backend:
   * 1. Valide les données (capacity >= 1, late_capacity >= 0)
   * 2. Met à jour ou crée la config dans la table 'configs'
   * 3. Log l'action (CONFIG_CHANGED)
   * 4. Retourne la nouvelle configuration
   *
   * Important:
   * - Cette config s'applique aux NOUVEAUX timeslots créés
   * - Les timeslots existants gardent leur ancienne config
   * - Pour changer un timeslot existant, il faudrait une route supplémentaire
   *
   * @param {Object} config - Configuration de capacité
   * @param {number} config.capacity - Capacité normale (min: 1)
   * @param {number} config.late_capacity - Capacité tardive (min: 0)
   * @returns {Promise<Object>} Configuration mise à jour
   * @returns {string} message - Message de confirmation
   * @returns {number} capacity - Nouvelle capacité
   * @returns {number} late_capacity - Nouvelle late capacity
   *
   * @example
   * await adminRoutes.updateCapacity({ capacity: 10, late_capacity: 3 });
   * // { message: 'Capacity configuration updated successfully', capacity: 10, late_capacity: 3 }
   */
  updateCapacity(config) {
    return api.post('/admin/config/capacity', config);
  },

  // ==================== INTERNAL TOOLS (AI) ====================

  /**
   * POST /admin/internal/tools/booking-status
   * [Internal] Récupère le status d'une réservation pour l'AI
   *
   * Backend: Route::post('/booking-status', [InternalToolsController::class, 'getBookingStatus']);
   * Middleware: auth:sanctum
   * Utilisé par: AI Assistant
   *
   * @param {Object} params - Paramètres de recherche
   * @returns {Promise<Object>} Status du booking
   */
  internalBookingStatus(params) {
    return api.post('/admin/internal/tools/booking-status', params);
  },

  /**
   * POST /admin/internal/tools/user-bookings
   * [Internal] Récupère les bookings d'un utilisateur pour l'AI
   *
   * Backend: Route::post('/user-bookings', [InternalToolsController::class, 'getUserBookings']);
   * Middleware: auth:sanctum
   * Utilisé par: AI Assistant
   *
   * @param {Object} params - Paramètres de recherche
   * @returns {Promise<Array>} Liste des bookings
   */
  internalUserBookings(params) {
    return api.post('/admin/internal/tools/user-bookings', params);
  },

  /**
   * POST /admin/internal/tools/port-schedule
   * [Internal] Récupère le schedule du port pour l'AI
   *
   * Backend: Route::post('/port-schedule', [InternalToolsController::class, 'getPortSchedule']);
   * Middleware: auth:sanctum
   * Utilisé par: AI Assistant
   *
   * @param {Object} params - Paramètres de recherche
   * @returns {Promise<Object>} Schedule du port
   */
  internalPortSchedule(params) {
    return api.post('/admin/internal/tools/port-schedule', params);
  },

  /**
   * POST /admin/internal/tools/available-slots
   * [Internal] Récupère les slots disponibles pour l'AI
   *
   * Backend: Route::post('/available-slots', [InternalToolsController::class, 'getAvailableSlots']);
   * Middleware: auth:sanctum
   * Utilisé par: AI Assistant
   *
   * @param {Object} params - Paramètres de recherche
   * @returns {Promise<Array>} Slots disponibles
   */
  internalAvailableSlots(params) {
    return api.post('/admin/internal/tools/available-slots', params);
  },
};

export default adminRoutes;

/**
 * Booking Routes
 * Liaison avec: Backend/apcs-backend/routes/api.php (lignes 27-35)
 *
 * Routes Backend (auth:sanctum + booking prefix):
 * - GET /booking/{id} → BookingController::getBookingById (Admin only)
 * - GET /booking/{date}/{hour} → BookingController::getBookingsByDateAndHour (Carrier)
 * - POST /booking → BookingController::createBooking (Carrier)
 * - PUT /booking/{id}/status → BookingController::updateBookingStatus (Carrier)
 * - PUT /booking/{id}/reschedule → BookingController::rescheduleBooking (Carrier)
 * - DELETE /booking/{id} → BookingController::deleteBooking (Carrier)
 */

import api from './api.routes';

export const bookingRoutes = {
  /**
   * GET /booking/{id}
   * Récupère une réservation par son ID
   *
   * Backend: Route::get('/{id}', [BookingController::class, 'getBookingById']);
   * Middleware: auth:sanctum
   * Roles: Admin uniquement
   * Controller: Backend/apcs-backend/app/Http/Controllers/BookingController.php (ligne 15)
   *
   * @param {string} bookingId - ID de la réservation
   * @returns {Promise<Object>} Détails de la réservation
   * @returns {string} booking_id - ID de la réservation
   * @returns {string} truck_number - Numéro du camion
   * @returns {Object} timeslot - Créneau horaire
   * @returns {string} status - Status (pending, in, out)
   */
  getById(bookingId) {
    return api.get(`/booking/${bookingId}`);
  },

  /**
   * GET /booking/{date}/{hour}
   * Récupère les réservations de l'utilisateur pour une date et heure
   *
   * Backend: Route::get('/{date}/{hour}', [BookingController::class, 'getBookingsByDateAndHour']);
   * Middleware: auth:sanctum
   * Roles: Carrier, Admin
   * Controller: Backend/apcs-backend/app/Http/Controllers/BookingController.php (ligne 39)
   *
   * @param {string} date - Date au format YYYY-MM-DD
   * @param {string} hour - Heure au format HH:00
   * @returns {Promise<Array>} Liste des réservations
   */
  getByDateAndHour(date, hour) {
    return api.get(`/booking/${date}/${hour}`);
  },

  /**
   * POST /booking
   * Crée une nouvelle réservation
   *
   * Backend: Route::post('/', [BookingController::class, 'createBooking']);
   * Middleware: auth:sanctum
   * Roles: Carrier, Admin
   * Controller: Backend/apcs-backend/app/Http/Controllers/BookingController.php (ligne 77)
   *
   * Logique Backend:
   * 1. Vérifie que l'utilisateur est carrier ou admin
   * 2. Trouve ou crée le timeslot avec la config de capacité
   * 3. Vérifie que le timeslot n'est pas plein
   * 4. Crée la réservation avec status 'pending'
   * 5. Log l'action (NEW_BOOKING)
   *
   * @param {Object} bookingData - Données de la réservation
   * @param {string} bookingData.truck_number - Numéro du camion
   * @param {Object} bookingData.timeslot - Créneau horaire
   * @param {string} bookingData.timeslot.date - Date (YYYY-MM-DD)
   * @param {string} bookingData.timeslot.hour_start - Heure de début (HH:00)
   * @returns {Promise<Object>} { booking_id, message }
   */
  create(bookingData) {
    return api.post('/booking', bookingData);
  },

  /**
   * PUT /booking/{id}/status
   * Met à jour le status d'une réservation
   *
   * Backend: Route::put('/{id}/status', [BookingController::class, 'updateBookingStatus']);
   * Middleware: auth:sanctum
   * Roles: Carrier (own bookings), Admin (all)
   * Controller: Backend/apcs-backend/app/Http/Controllers/BookingController.php (ligne 130)
   *
   * Status valides: pending, in, out
   * - pending: Réservation créée
   * - in: Camion arrivé au terminal
   * - out: Chargement/déchargement terminé
   *
   * @param {string} bookingId - ID de la réservation
   * @param {string} status - Nouveau status (pending, in, out)
   * @returns {Promise<Object>} { message, booking_id, status }
   */
  updateStatus(bookingId, status) {
    return api.put(`/booking/${bookingId}/status`, { status });
  },

  /**
   * PUT /booking/{id}/reschedule
   * Reprogramme une réservation à un nouveau créneau
   *
   * Backend: Route::put('/{id}/reschedule', [BookingController::class, 'rescheduleBooking']);
   * Middleware: auth:sanctum
   * Roles: Carrier (own bookings), Admin (all)
   * Controller: Backend/apcs-backend/app/Http/Controllers/BookingController.php (ligne 170)
   *
   * Logique Backend:
   * 1. Vérifie que l'utilisateur possède la réservation
   * 2. Trouve ou crée le nouveau timeslot
   * 3. Vérifie la capacité du nouveau timeslot
   * 4. Met à jour la réservation
   * 5. Log l'action (MODIFIED_BOOKING)
   *
   * @param {string} bookingId - ID de la réservation
   * @param {Object} timeslot - Nouveau créneau horaire
   * @param {string} timeslot.date - Date (YYYY-MM-DD)
   * @param {string} timeslot.hour_start - Heure de début (HH:00)
   * @returns {Promise<Object>} { message, booking_id }
   */
  reschedule(bookingId, timeslot) {
    return api.put(`/booking/${bookingId}/reschedule`, { timeslot });
  },

  /**
   * DELETE /booking/{id}
   * Supprime une réservation
   *
   * Backend: Route::delete('/{id}', [BookingController::class, 'deleteBooking']);
   * Middleware: auth:sanctum
   * Roles: Carrier (own bookings), Admin (all)
   * Controller: Backend/apcs-backend/app/Http/Controllers/BookingController.php (ligne 230)
   *
   * Logique Backend:
   * 1. Vérifie que l'utilisateur possède la réservation
   * 2. Log l'action avant suppression (DELETED_BOOKING)
   * 3. Supprime la réservation
   *
   * @param {string} bookingId - ID de la réservation
   * @returns {Promise<Object>} { message }
   */
  delete(bookingId) {
    return api.delete(`/booking/${bookingId}`);
  },
};

export default bookingRoutes;

/**
 * Gate Routes
 * Liaison avec: Backend/apcs-backend/routes/api.php (lignes 43-47)
 *
 * Routes Backend (auth:sanctum + gate prefix):
 * - GET /gate/qr/{bookingId} → GateController::getQrCode (Carrier)
 * - POST /gate/scan → GateController::scanQrCode (Operator)
 * - POST /gate/complete → GateController::completeShipment (Operator)
 */

import api from './api.routes';

export const gateRoutes = {
  /**
   * GET /gate/qr/{bookingId}
   * Génère et récupère le QR code pour une réservation
   *
   * Backend: Route::get('/qr/{bookingId}', [GateController::class, 'getQrCode']);
   * Middleware: auth:sanctum
   * Roles: Carrier (own bookings), Admin (all)
   * Controller: Backend/apcs-backend/app/Http/Controllers/GateController.php (ligne 21)
   *
   * Logique Backend:
   * 1. Vérifie que l'utilisateur est carrier ou admin
   * 2. Vérifie que l'utilisateur possède la réservation
   * 3. Cherche si un QR code existe déjà
   * 4. Si non: génère un nouveau QR string (apk_xxxxx)
   * 5. Sauvegarde dans la table qr_codes
   * 6. Log l'action (QR_GENERATED)
   * 7. Retourne la string QR
   *
   * Le QR code peut être scanné par un operator pour enregistrer l'arrivée
   *
   * @param {string} bookingId - ID de la réservation
   * @returns {Promise<Object>} { qr }
   * @returns {string} qr - String du QR code (format: apk_xxxxxxxxxx)
   *
   * @example
   * const { qr } = await gateRoutes.getQR('123');
   * // Afficher le QR code avec une librairie comme qrcode.react
   * <QRCode value={qr} />
   */
  getQR(bookingId) {
    return api.get(`/gate/qr/${bookingId}`);
  },

  /**
   * POST /gate/scan
   * Scanne un QR code et enregistre l'arrivée du camion
   *
   * Backend: Route::post('/scan', [GateController::class, 'scanQrCode']);
   * Middleware: auth:sanctum
   * Roles: Operator, Admin
   * Controller: Backend/apcs-backend/app/Http/Controllers/GateController.php (ligne 68)
   *
   * Logique Backend Complexe - Gestion Late Arrival:
   * 1. Vérifie que l'utilisateur est operator ou admin
   * 2. Trouve le QR code dans la base
   * 3. Récupère le booking associé avec son timeslot
   * 4. Calcule la fenêtre horaire du booking (1h)
   * 5. Détermine si le camion est:
   *    - Trop tôt (avant le slot) → Erreur
   *    - À l'heure (dans la fenêtre) → Status 'in', arrival_type: 'on_time'
   *    - En retard (après la fenêtre) → Gestion late arrival
   *
   * Gestion Late Arrival:
   * - Vérifie late_capacity du slot original
   * - Si disponible: utilise late slot original (arrival_type: 'late_original_slot')
   * - Si plein: cherche le prochain slot avec late capacity disponible
   * - Si trouvé: reprogramme le booking (arrival_type: 'late_rescheduled')
   * - Si aucun: retourne erreur + incident log
   *
   * @param {string} qrCode - String du QR code scanné
   * @returns {Promise<Object>} Résultat du scan
   * @returns {string} message - Message de confirmation
   * @returns {string} booking_id - ID de la réservation
   * @returns {string} truck_number - Numéro du camion
   * @returns {string} status - Status (in)
   * @returns {string} arrival_type - Type d'arrivée:
   *   - 'on_time': À l'heure
   *   - 'late_original_slot': En retard mais slot original
   *   - 'late_rescheduled': En retard, reprogrammé
   * @returns {string} [new_timeslot_id] - Si reprogrammé
   * @returns {Object} [new_timeslot] - Si reprogrammé
   *
   * @example
   * // Scan normal (à l'heure)
   * const result = await gateRoutes.scan('apk_xxxxx');
   * // { message: '...', arrival_type: 'on_time', status: 'in' }
   *
   * // Scan en retard
   * const result = await gateRoutes.scan('apk_xxxxx');
   * // { arrival_type: 'late_rescheduled', new_timeslot: {...} }
   */
  scan(qrCode) {
    return api.post('/gate/scan', { qr: qrCode });
  },

  /**
   * POST /gate/complete
   * Marque une livraison comme terminée et libère le slot
   *
   * Backend: Route::post('/complete', [GateController::class, 'completeShipment']);
   * Middleware: auth:sanctum
   * Roles: Operator, Admin
   * Controller: Backend/apcs-backend/app/Http/Controllers/GateController.php (ligne 264)
   *
   * Logique Backend:
   * 1. Vérifie que l'utilisateur est operator
   * 2. Trouve le booking
   * 3. Vérifie que le status est 'in' (camion présent)
   * 4. Change le status à 'out'
   * 5. Log l'action (SHIPMENT_CONSUMED)
   * 6. Calcule l'occupancy avant/après
   * 7. Retourne les infos du slot libéré
   *
   * Important: Ce changement libère le slot immédiatement
   * Un autre booking peut maintenant utiliser ce slot
   *
   * @param {string} bookingId - ID de la réservation
   * @returns {Promise<Object>} Résultat
   * @returns {string} message - Message de confirmation
   * @returns {string} booking_id - ID de la réservation
   * @returns {string} truck_number - Numéro du camion
   * @returns {string} status - Status (out)
   * @returns {boolean} timeslot_freed - Toujours true
   * @returns {Object} timeslot_info - Informations du slot
   * @returns {number} timeslot_info.previous_occupancy - Occupation avant
   * @returns {number} timeslot_info.current_occupancy - Occupation après
   * @returns {number} timeslot_info.capacity - Capacité max
   * @returns {number} timeslot_info.late_capacity - Late capacity
   *
   * @example
   * const result = await gateRoutes.complete('123');
   * console.log(`Slot libéré: ${result.timeslot_info.current_occupancy}/${result.timeslot_info.capacity}`);
   */
  complete(bookingId) {
    return api.post('/gate/complete', { booking_id: bookingId });
  },
};

export default gateRoutes;

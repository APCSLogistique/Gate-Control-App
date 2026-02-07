/**
 * Gate Service
 * Utilise les routes définies dans src/routes/gate.routes.js
 */

import { gateRoutes } from '../routes/gate.routes';

export const gateService = {
  /**
   * Génère et récupère le QR code pour une réservation
   */
  async getQRCode(bookingId) {
    return gateRoutes.getQR(bookingId);
  },

  /**
   * Scanne un QR code au portail
   */
  async scanQRCode(qrCode) {
    return gateRoutes.scan(qrCode);
  },

  /**
   * Marque une livraison comme terminée et libère le slot
   */
  async completeShipment(bookingId) {
    return gateRoutes.complete(bookingId);
  },
};

/**
 * Booking Service
 * Utilise les routes définies dans src/routes/booking.routes.js
 */

import { bookingRoutes } from '../routes/booking.routes';

export const bookingService = {
  /**
   * Récupère une réservation par ID (Admin uniquement)
   */
  async getBookingById(bookingId) {
    return bookingRoutes.getById(bookingId);
  },

  /**
   * Récupère les réservations pour une date et heure
   */
  async getBookingsByDateHour(date, hour) {
    return bookingRoutes.getByDateAndHour(date, hour);
  },

  /**
   * Crée une nouvelle réservation
   */
  async createBooking(bookingData) {
    return bookingRoutes.create(bookingData);
  },

  /**
   * Met à jour le statut d'une réservation
   */
  async updateBookingStatus(bookingId, status) {
    return bookingRoutes.updateStatus(bookingId, status);
  },

  /**
   * Reprogramme une réservation
   */
  async rescheduleBooking(bookingId, timeslot) {
    return bookingRoutes.reschedule(bookingId, timeslot);
  },

  /**
   * Supprime une réservation
   */
  async deleteBooking(bookingId) {
    return bookingRoutes.delete(bookingId);
  },
};

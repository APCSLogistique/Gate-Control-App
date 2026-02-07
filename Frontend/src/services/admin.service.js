/**
 * Admin Service
 * Utilise les routes définies dans src/routes/admin.routes.js
 */

import { adminRoutes } from '../routes/admin.routes';

export const adminService = {
  /**
   * Récupère le planning d'aujourd'hui
   */
  async getTodaySchedule() {
    return adminRoutes.getTodaySchedule();
  },

  /**
   * Récupère le planning pour une date spécifique
   */
  async getScheduleByDate(date) {
    return adminRoutes.getScheduleByDate(date);
  },

  /**
   * Récupère le planning pour une plage de dates
   */
  async getScheduleRange(startDate, endDate) {
    return adminRoutes.getScheduleRange(startDate, endDate);
  },

  /**
   * Récupère les logs pour une plage de dates
   */
  async getLogsRange(startDate, endDate) {
    return adminRoutes.getLogs(startDate, endDate);
  },

  /**
   * Configure la capacité du terminal
   */
  async configureCapacity(capacityConfig) {
    return adminRoutes.updateCapacity(capacityConfig);
  },

  /**
   * Alias pour compatibilité
   */
  async updateCapacity(capacityConfig) {
    return this.configureCapacity(capacityConfig);
  },
};

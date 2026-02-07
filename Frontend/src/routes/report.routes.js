/**
 * Report Routes
 * Liaison avec: Backend/apcs-backend/routes/api.php
 *
 * Note: Les routes de Report n'apparaissent pas dans api.php
 * Ces routes doivent être ajoutées au backend si nécessaire
 *
 * Routes attendues:
 * - POST /report → Créer un rapport/incident
 * - GET /report/{date} → Récupérer les rapports d'une date
 * - POST /report/solve → Résoudre un rapport
 * - GET /report/pending → Récupérer les rapports en attente
 */

import api from './api.routes';

export const reportRoutes = {
  /**
   * POST /report
   * Crée un nouveau rapport/incident
   *
   * Note: Route à implémenter dans le backend
   *
   * @param {Object} reportData - Données du rapport
   * @param {string} reportData.title - Titre du rapport
   * @param {string} reportData.description - Description
   * @param {string} reportData.type - Type (incident, issue, etc.)
   * @returns {Promise<Object>} Rapport créé
   */
  create(reportData) {
    return api.post('/report', reportData);
  },

  /**
   * GET /report/{date}
   * Récupère les rapports d'une date spécifique
   *
   * Note: Route à implémenter dans le backend
   *
   * @param {string} date - Date au format YYYY-MM-DD
   * @returns {Promise<Array>} Liste des rapports
   */
  getByDate(date) {
    return api.get(`/report/${date}`);
  },

  /**
   * POST /report/solve
   * Marque un rapport comme résolu
   *
   * Note: Route à implémenter dans le backend
   *
   * @param {Object} data - Données de résolution
   * @param {string} data.report_id - ID du rapport
   * @param {string} data.solution - Description de la solution
   * @returns {Promise<Object>} Rapport mis à jour
   */
  solve(data) {
    return api.post('/report/solve', data);
  },

  /**
   * GET /report/pending
   * Récupère tous les rapports en attente
   *
   * Note: Route à implémenter dans le backend
   *
   * @returns {Promise<Array>} Liste des rapports en attente
   */
  getPending() {
    return api.get('/report/pending');
  },
};

export default reportRoutes;

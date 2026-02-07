/**
 * Report Service
 * Gère les opérations liées aux incidents et rapports
 */

import apiClient from './api.client';
import { API_ENDPOINTS } from '../config/api.config';

export const reportService = {
  /**
   * Crée un nouveau rapport d'incident (Carrier/Operator)
   * @param {Object} incidentData - Données de l'incident
   * @param {string} incidentData.booking_id - ID de la réservation
   * @param {string} incidentData.message - Message de l'incident
   * @returns {Promise<Object>} Incident créé
   */
  async createIncident(incidentData) {
    return apiClient.post(API_ENDPOINTS.REPORT.CREATE, incidentData);
  },

  /**
   * Récupère les incidents d'une date spécifique (Admin)
   * @param {string} date - Date au format YYYY-MM-DD
   * @returns {Promise<Object>} Incidents de la date
   */
  async getIncidentsByDate(date) {
    return apiClient.get(API_ENDPOINTS.REPORT.BY_DATE(date));
  },

  /**
   * Marque un incident comme résolu (Admin)
   * @param {Object} solutionData - Données de résolution
   * @param {string} solutionData.incident_id - ID de l'incident
   * @param {string} solutionData.status - Nouveau statut
   * @param {string} solutionData.response - Réponse de l'admin
   * @returns {Promise<Object>} Incident résolu
   */
  async solveIncident(solutionData) {
    return apiClient.post(API_ENDPOINTS.REPORT.SOLVE, solutionData);
  },

  /**
   * Récupère tous les incidents en attente (Admin)
   * @returns {Promise<Array>} Liste des incidents en attente
   */
  async getPendingIncidents() {
    return apiClient.get(API_ENDPOINTS.REPORT.PENDING);
  },
};

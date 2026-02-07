/**
 * AI Service
 * Gère les opérations liées à l'assistant IA et aux chats
 */

import apiClient from './api.client';
import { API_ENDPOINTS } from '../config/api.config';

export const aiService = {
  /**
   * Crée un nouveau chat
   * @returns {Promise<Object>} Chat créé
   * @returns {string} chat_id - ID du chat
   * @returns {string} user_id - ID de l'utilisateur
   * @returns {string} created_at - Date de création
   */
  async createChat() {
    return apiClient.get(API_ENDPOINTS.AI.CREATE_CHAT);
  },

  /**
   * Récupère les messages d'un chat
   * @param {string} chatId - ID du chat
   * @returns {Promise<Array>} Liste des messages
   */
  async getChatMessages(chatId) {
    return apiClient.get(API_ENDPOINTS.AI.GET_MESSAGES(chatId));
  },

  /**
   * Génère une réponse de l'IA
   * @param {Object} messageData - Données du message
   * @param {string} messageData.chat_id - ID du chat
   * @param {string} messageData.message - Message de l'utilisateur
   * @returns {Promise<Object>} Réponse de l'IA
   * @returns {string} message - Réponse générée
   */
  async generateResponse(messageData) {
    return apiClient.post(API_ENDPOINTS.AI.GENERATE, messageData);
  },
};

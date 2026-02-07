/**
 * AI / Chat Routes
 * Liaison avec: Backend/apcs-backend/routes/api.php
 *
 * Note: Les routes AI/Chat doivent être ajoutées au backend
 * Structure attendue basée sur le fichier de spécification
 *
 * Routes attendues:
 * - POST /chat → Créer une nouvelle conversation
 * - GET /chat/{chatId}/messages → Récupérer les messages
 * - POST /ai/generate → Générer une réponse AI
 */

import api from './api.routes';

export const aiRoutes = {
  /**
   * POST /chat
   * Crée une nouvelle conversation chat
   *
   * Note: Route à implémenter dans le backend
   *
   * @returns {Promise<Object>} { chat_id }
   */
  createChat() {
    return api.post('/chat');
  },

  /**
   * GET /chat/{chatId}/messages
   * Récupère les messages d'une conversation
   *
   * Note: Route à implémenter dans le backend
   *
   * @param {string} chatId - ID de la conversation
   * @returns {Promise<Array>} Liste des messages
   */
  getMessages(chatId) {
    return api.get(`/chat/${chatId}/messages`);
  },

  /**
   * POST /ai/generate
   * Génère une réponse AI
   *
   * Note: Route à implémenter dans le backend
   *
   * @param {Object} data - Données de la requête
   * @param {string} data.message - Message de l'utilisateur
   * @param {string} data.chat_id - ID de la conversation (optionnel)
   * @returns {Promise<Object>} { response, chat_id }
   */
  generate(data) {
    return api.post('/ai/generate', data);
  },

  /**
   * Helper: Envoyer un message et recevoir une réponse
   * @param {string} message - Message de l'utilisateur
   * @param {string} chatId - ID de la conversation (optionnel)
   * @returns {Promise<Object>} Réponse complète
   */
  async sendMessage(message, chatId = null) {
    return this.generate({ message, chat_id: chatId });
  },
};

export default aiRoutes;

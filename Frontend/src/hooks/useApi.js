/**
 * Custom Hooks pour l'API
 * Hooks React personnalisés pour faciliter l'utilisation des services API
 */

import { useState, useEffect, useCallback } from 'react';
import {
  userService,
  bookingService,
  timeslotService,
  gateService,
  adminService,
  reportService,
  aiService,
} from '../services';

/**
 * Hook générique pour les requêtes API
 * @param {Function} serviceFunction - Fonction du service à appeler
 * @param {Array} dependencies - Dépendances pour re-exécuter la requête
 * @returns {Object} { data, loading, error, refetch }
 */
export const useApi = (serviceFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await serviceFunction();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Hook pour récupérer le profil utilisateur
 */
export const useUserProfile = () => {
  return useApi(() => userService.getProfile());
};

/**
 * Hook pour récupérer les réservations de l'utilisateur
 */
export const useUserBookings = () => {
  return useApi(() => userService.getUserBookings());
};

/**
 * Hook pour récupérer une réservation par ID
 * @param {string} bookingId - ID de la réservation
 */
export const useBooking = (bookingId) => {
  return useApi(() => bookingService.getBookingById(bookingId), [bookingId]);
};

/**
 * Hook pour récupérer les réservations par date et heure
 * @param {string} date - Date (YYYY-MM-DD)
 * @param {string} hour - Heure (HH)
 */
export const useBookingsByDateHour = (date, hour) => {
  return useApi(() => bookingService.getBookingsByDateHour(date, hour), [date, hour]);
};

/**
 * Hook pour créer une réservation
 */
export const useCreateBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const createBooking = async (bookingData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await bookingService.createBooking(bookingData);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createBooking, data, loading, error };
};

/**
 * Hook pour récupérer la disponibilité d'un créneau
 * @param {string} date - Date (YYYY-MM-DD)
 * @param {string} hour - Heure (HH)
 */
export const useTimeSlotAvailability = (date, hour) => {
  return useApi(() => timeslotService.getTimeSlotAvailability(date, hour), [date, hour]);
};

/**
 * Hook pour récupérer le QR code
 * @param {string} bookingId - ID de la réservation
 */
export const useQRCode = (bookingId) => {
  return useApi(() => gateService.getQRCode(bookingId), [bookingId]);
};

/**
 * Hook pour scanner un QR code
 */
export const useScanQRCode = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const scanQRCode = async (qrCode) => {
    try {
      setLoading(true);
      setError(null);
      const result = await gateService.scanQRCode(qrCode);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { scanQRCode, data, loading, error };
};

/**
 * Hook pour récupérer le planning d'aujourd'hui
 */
export const useTodaySchedule = () => {
  return useApi(() => adminService.getTodaySchedule());
};

/**
 * Hook pour récupérer le planning d'une date
 * @param {string} date - Date (YYYY-MM-DD)
 */
export const useScheduleByDate = (date) => {
  return useApi(() => adminService.getScheduleByDate(date), [date]);
};

/**
 * Hook pour récupérer les logs
 * @param {string} startDate - Date de début (YYYY-MM-DD)
 * @param {string} endDate - Date de fin (YYYY-MM-DD)
 */
export const useLogs = (startDate, endDate) => {
  return useApi(() => adminService.getLogsRange(startDate, endDate), [startDate, endDate]);
};

/**
 * Hook pour récupérer les incidents en attente
 */
export const usePendingIncidents = () => {
  return useApi(() => reportService.getPendingIncidents());
};

/**
 * Hook pour créer un incident
 */
export const useCreateIncident = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const createIncident = async (incidentData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await reportService.createIncident(incidentData);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createIncident, data, loading, error };
};

/**
 * Hook pour l'assistant IA
 */
export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);

  const createChat = async () => {
    try {
      setLoading(true);
      const result = await aiService.createChat();
      setChatId(result.chat_id);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (id) => {
    try {
      setLoading(true);
      const result = await aiService.getChatMessages(id || chatId);
      setMessages(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (message) => {
    try {
      setLoading(true);
      setError(null);
      const result = await aiService.generateResponse({
        chat_id: chatId,
        message,
      });
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    chatId,
    messages,
    loading,
    error,
    createChat,
    loadMessages,
    sendMessage,
  };
};

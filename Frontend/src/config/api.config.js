/**
 * API Configuration
 * Configuration centrale pour toutes les requêtes API
 */

export const API_CONFIG = {
  // Base URL de l'API - à modifier selon l'environnement
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',

  // Timeout par défaut (30 secondes)
  TIMEOUT: 30000,

  // Headers par défaut
  HEADERS: {
    'Content-Type': 'application/json',
  },

  // Storage keys
  STORAGE_KEYS: {
    USER: 'apcs_user',
    TOKEN: 'apcs_token',
  },
};

/**
 * API Endpoints
 * Tous les endpoints de l'API organisés par module
 */
export const API_ENDPOINTS = {
  // User API
  USER: {
    PROFILE: '/user/profile',
    BOOKINGS: '/user/bookings',
  },

  // Bookings API
  BOOKING: {
    BASE: '/booking',
    BY_ID: (id) => `/booking/${id}`,
    BY_DATE_HOUR: (date, hour) => `/booking/${date}/${hour}`,
    STATUS: (id) => `/booking/${id}/status`,
    RESCHEDULE: (id) => `/booking/${id}/reschedule`,
    DELETE: (id) => `/booking/${id}`,
  },

  // TimeSlot API
  TIMESLOT: {
    BY_DATE_HOUR: (date, hour) => `/timeslot/${date}/${hour}`,
  },

  // Gate API
  GATE: {
    QR: (bookingId) => `/gate/qr/${bookingId}`,
    SCAN: '/gate/scan',
    COMPLETE: '/gate/complete',
  },

  // Admin API
  ADMIN: {
    SCHEDULE: '/admin/schedule',
    SCHEDULE_RANGE: (startDate, endDate) => `/admin/schedule/${startDate}/${endDate}`,
    SCHEDULE_DATE: (date) => `/admin/data/schedule/${date}`,
    LOGS: (startDate, endDate) => `/admin/data/logs/${startDate}/${endDate}`,
    CONFIG_CAPACITY: '/admin/config/capacity',
  },

  // Report API
  REPORT: {
    CREATE: '/report',
    BY_DATE: (date) => `/report/${date}`,
    SOLVE: '/report/solve',
    PENDING: '/report/pending',
  },

  // AI / Chat API
  AI: {
    CREATE_CHAT: '/chat',
    GET_MESSAGES: (chatId) => `/chat/${chatId}/messages`,
    GENERATE: '/ai/generate',
  },

  // Internal Tools (utilisé par l'AI)
  INTERNAL: {
    BOOKING_STATUS: '/internal/tools/booking-status',
    USER_BOOKINGS: '/internal/tools/user-bookings',
    PORT_SCHEDULE: '/internal/tools/port-schedule',
  },
};

/**
 * Log Codes - Codes de statut des événements système
 */
export const LOG_CODES = {
  NEW_BOOKING: 'NEW_BOOKING',
  MODIFIED_BOOKING: 'MODIFIED_BOOKING',
  DELETED_BOOKING: 'DELETED_BOOKING',
  QR_GENERATED: 'QR_GENERATED',
  CARRIER_ARRIVED: 'CARRIER_ARRIVED',
  SHIPMENT_CONSUMED: 'SHIPMENT_CONSUMED',
  CONFIG_CHANGED: 'CONFIG_CHANGED',
  CONFIG_LATE_CHANGED: 'CONFIG_LATE_CHANGED',
  NEW_INCIDENT: 'NEW_INCIDENT',
};

/**
 * Booking Status
 * Backend uses: pending, in, out
 */
export const BOOKING_STATUS = {
  PENDING: 'pending',
  IN: 'in',
  OUT: 'out',
};

/**
 * Incident Status
 */
export const INCIDENT_STATUS = {
  PENDING: 'pending',
  RESOLVED: 'resolved',
};

/**
 * User Roles
 */
export const USER_ROLES = {
  ADMIN: 'admin',
  OPERATOR: 'operator',
  CARRIER: 'carrier',
};

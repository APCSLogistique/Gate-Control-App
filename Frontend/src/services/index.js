/**
 * Services Index
 * Point d'entrée centralisé pour tous les services
 */

// API Client
export { default as apiClient } from './api.client';

// Services
export { authService } from './auth.service';
export { userService } from './user.service';
export { bookingService } from './booking.service';
export { timeslotService } from './timeslot.service';
export { gateService } from './gate.service';
export { adminService } from './admin.service';
export { reportService } from './report.service';
export { aiService } from './ai.service';

/**
 * Routes Index
 * Point d'entrée principal pour toutes les routes API
 * Fait la liaison entre le frontend et le backend Laravel
 */

export * from './api.routes';
export * from './auth.routes';
export * from './user.routes';
export * from './booking.routes';
export * from './timeslot.routes';
export * from './gate.routes';
export * from './admin.routes';
export * from './report.routes';
export * from './ai.routes';

// Re-export default API instance
export { default as api } from './api.routes';

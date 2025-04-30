/**
 * API client exports
 */

// Export the API factory and instance
export { createApi, api } from './api';

// Export all endpoints
export * from './endpoints';

// Re-export types
export type { QueryDefinition, MutationDefinition } from './api';

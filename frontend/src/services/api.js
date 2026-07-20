/**
 * API Service — Centralized HTTP client for backend communication.
 * 
 * All API calls go through this module. Uses axios with a base URL
 * configured to our FastAPI backend. This makes it easy to:
 * 1. Change the backend URL in one place
 * 2. Add auth headers later
 * 3. Handle errors consistently
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ========================
// Document APIs
// ========================

export const documentAPI = {
  /** Upload a document file */
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /** List all documents with optional filters */
  list: (params = {}) => api.get('/documents', { params }),

  /** Get a single document by ID */
  get: (id) => api.get(`/documents/${id}`),

  /** Delete a document */
  delete: (id) => api.delete(`/documents/${id}`),
};

// ========================
// Asset APIs
// ========================

export const assetAPI = {
  /** List all assets */
  list: (params = {}) => api.get('/assets', { params }),

  /** Get asset details */
  get: (id) => api.get(`/assets/${id}`),

  /** Get asset incident history */
  getIncidents: (id) => api.get(`/assets/${id}/incidents`),
};

// ========================
// Chat APIs
// ========================

export const chatAPI = {
  /** Send a message to the AI copilot */
  send: (message, sessionId = null) =>
    api.post('/chat', { message, session_id: sessionId }),

  /** Get chat history for a session */
  getHistory: (sessionId) => api.get(`/chat/history/${sessionId}`),
};

// ========================
// Analytics APIs
// ========================

export const analyticsAPI = {
  /** Get dashboard overview stats */
  getOverview: () => api.get('/analytics/overview'),

  /** Get detected patterns */
  getPatterns: () => api.get('/analytics/patterns'),

  /** Get compliance records */
  getCompliance: () => api.get('/analytics/compliance'),

  /** Get risk scores */
  getRiskScores: () => api.get('/analytics/risk-scores'),

  /** Get incident timeline */
  getTimeline: () => api.get('/analytics/timeline'),
};

// ========================
// Search API
// ========================

export const searchAPI = {
  /** Search documents */
  search: (query, category = null) =>
    api.get('/search', { params: { q: query, category } }),
};

export default api;

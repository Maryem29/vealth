/**
 * API Service for Vealth Frontend
 * Handles all backend communication
 */

import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add session ID
api.interceptors.request.use(
  (config) => {
    // Add session ID to headers if available
    const sessionId = localStorage.getItem('vealth_session_id');
    if (sessionId) {
      config.headers['x-session-id'] = sessionId;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error);
    
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const errorMessage = error.response.data?.error || error.response.data?.message || 'Server error occurred';
      throw new Error(errorMessage);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something else happened
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
);

/**
 * API Methods
 */
const apiService = {
  // Health check
  async healthCheck() {
    try {
      const response = await api.get('/health');
      return response;
    } catch (error) {
      throw new Error('Backend service is not available');
    }
  },

  // Upload image
  async uploadImage(imageFile, sessionId) {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('sessionId', sessionId);

      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload progress: ${percentCompleted}%`);
        },
      });

      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to upload image');
    }
  },

  // Analyze uploaded image
  async analyzeImage(uploadId, sessionId) {
    try {
      const response = await api.post('/analyze', {
        uploadId,
        sessionId,
      });

      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to analyze image');
    }
  },

  // Generate PDF report
  async generateReport(analysisId, sessionId, reportOptions = {}) {
    try {
      const response = await api.post('/reports/generate', {
        analysisId,
        sessionId,
        reportOptions,
      });

      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to generate report');
    }
  },

  // Get upload history
  async getUploadHistory(sessionId) {
    try {
      const response = await api.get('/upload/history', {
        headers: {
          'x-session-id': sessionId,
        },
      });

      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch upload history');
    }
  },

  // Get analysis result
  async getAnalysisResult(analysisId, sessionId) {
    try {
      const response = await api.get(`/analyze/${analysisId}`, {
        headers: {
          'x-session-id': sessionId,
        },
      });

      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch analysis result');
    }
  },

  // Get report history
  async getReportHistory(sessionId) {
    try {
      const response = await api.get('/reports/history', {
        headers: {
          'x-session-id': sessionId,
        },
      });

      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch report history');
    }
  },
};

export default apiService;
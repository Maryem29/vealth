/**
 * Session Management Utility
 * Handles user session persistence across browser sessions
 */

const SESSION_KEY = 'vealth_session_id';

/**
 * Generate a new unique session ID
 * @returns {string} UUID-like session ID
 */
export const generateSessionId = () => {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

/**
 * Get existing session ID from localStorage
 * @returns {string|null} Session ID or null if not found
 */
export const getSessionId = () => {
  try {
    return localStorage.getItem(SESSION_KEY);
  } catch (error) {
    console.warn('localStorage not available:', error);
    return null;
  }
};

/**
 * Store session ID in localStorage
 * @param {string} sessionId - Session ID to store
 */
export const setSessionId = (sessionId) => {
  try {
    localStorage.setItem(SESSION_KEY, sessionId);
  } catch (error) {
    console.warn('localStorage not available:', error);
  }
};

/**
 * Remove session ID from localStorage
 */
export const clearSession = () => {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.warn('localStorage not available:', error);
  }
};

/**
 * Get or create session ID
 * @returns {string} Valid session ID
 */
export const ensureSessionId = () => {
  let sessionId = getSessionId();
  if (!sessionId) {
    sessionId = generateSessionId();
    setSessionId(sessionId);
  }
  return sessionId;
};
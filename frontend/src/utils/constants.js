/**
 * constants.js
 * Application-wide constants and configuration
 */

// API Base URL
export const API_BASE_URL = "http://localhost:8000";

// API Endpoints
export const API_ENDPOINTS = {
  UPLOAD_RESUME: `${API_BASE_URL}/api/analyze/`,
  GET_STATS: `${API_BASE_URL}/api/stats/`,
  GET_SCREENINGS: `${API_BASE_URL}/api/screenings/`,
  DELETE_CANDIDATE: (id) => `${API_BASE_URL}/api/candidates/${id}`,
  LOGIN: `${API_BASE_URL}/api/login`,
  LOGOUT: `${API_BASE_URL}/api/logout`,
};

// Screening Status
export const STATUS = {
  SHORTLIST: "Shortlist",
  REJECT: "Reject",
};

// Score Thresholds
export const SCORE_THRESHOLDS = {
  SHORTLIST: 7.0,
  REJECT: 0,
};

// GPA Categories
export const GPA_CATEGORIES = {
  BEST: "Best (9.0+)",
  GOOD: "Good (8.0-9.0)",
  AVERAGE: "Average (7.0-8.0)",
  BELOW_AVERAGE: "Below Average (6.0-7.0)",
  POOR: "Poor (<6.0)",
  NOT_SPECIFIED: "Not specified",
};

// Animation Delays
export const ANIMATION_DELAYS = {
  FAST: 100,
  MEDIUM: 200,
  SLOW: 300,
};

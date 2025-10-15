// API Configuration for different environments

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// Firebase Functions URL (update with your actual project ID)
const FIREBASE_FUNCTIONS_URL = 'https://us-central1-your-project-id.cloudfunctions.net/api';

// Local development URL
const LOCAL_API_URL = 'http://localhost:5000/api';

// Export API URL based on environment
export const API_URL = isProduction ? FIREBASE_FUNCTIONS_URL : LOCAL_API_URL;

// Export base URL without /api for direct endpoints
export const BASE_URL = isProduction 
  ? 'https://us-central1-your-project-id.cloudfunctions.net'
  : 'http://localhost:5000';

// Configuration object
export const config = {
  apiUrl: API_URL,
  baseUrl: BASE_URL,
  environment: process.env.NODE_ENV || 'development',
  isDevelopment,
  isProduction,
};

export default config;

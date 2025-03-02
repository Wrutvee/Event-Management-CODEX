import axios from 'axios';
import { sanitizeInput } from '../utils/security';

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Important for cookies
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    // Get CSRF token from cookie
    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];

    if (csrfToken) {
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(csrfToken);
    }

    // Sanitize request data if it's a string
    if (config.data && typeof config.data === 'string') {
      config.data = sanitizeInput(config.data);
    } else if (config.data && typeof config.data === 'object') {
      // Sanitize object properties that are strings
      Object.keys(config.data).forEach(key => {
        if (typeof config.data[key] === 'string' && key !== 'password') {
          config.data[key] = sanitizeInput(config.data[key]);
        }
      });
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Don't refresh page for auth verification failures
    if (error.response?.status === 401 && 
        error.config.url === '/auth/verify') {
      return Promise.reject(error);
    }

    if (error.code === 'ECONNABORTED') {
      return Promise.reject({
        message: 'Request timed out. Please try again.'
      });
    }

    // Handle CSRF errors
    if (error.response?.status === 403 && 
        error.response?.data?.message?.includes('CSRF')) {
      // Refresh the page to get a new CSRF token
      window.location.reload();
      return Promise.reject({
        message: 'Session expired. Please try again.'
      });
    }

    return Promise.reject(error.response?.data || error);
  }
);

export default axiosInstance;
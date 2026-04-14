import axios from 'axios';

// Smart API URL construction that prevents double '/api' paths
const getBaseURL = () => {
  const envURL = import.meta.env.VITE_API_URL;
  
  if (!envURL) {
    return 'http://localhost:5000/api';
  }
  
  // Remove trailing slash if present
  const cleanURL = envURL.endsWith('/') ? envURL.slice(0, -1) : envURL;
  
  // Check if URL already ends with /api
  if (cleanURL.endsWith('/api')) {
    return cleanURL;
  }
  
  // Add /api if not present
  return `${cleanURL}/api`;
};

const API_URL = getBaseURL();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network Error: Unable to connect to server');
      return Promise.reject(new Error('Network error - please check your connection'));
    }
    
    // Handle specific status codes
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    if (error.response?.status === 403) {
      console.error('Forbidden: You don\'t have permission to access this resource');
    }
    
    if (error.response?.status === 500) {
      console.error('Server Error: Something went wrong on the server');
    }
    
    return Promise.reject(error);
  }
);

export default api;

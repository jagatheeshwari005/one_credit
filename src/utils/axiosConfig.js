import axios from 'axios';
import { toast } from 'react-toastify';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000',
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Backend expects 'x-auth-token' header. Keep Authorization as a fallback for third-party APIs.
      config.headers['x-auth-token'] = token;
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Axios error:', error);

    // Handle network errors
    if (error.code === 'ERR_NETWORK' || !error.response) {
      toast.error('Network Error: Cannot connect to server. Please check if the backend is running on port 5000.');
      return Promise.reject(error);
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout. Please try again.');
      return Promise.reject(error);
    }

    // Handle 401 unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Handle other HTTP errors
    const errorMsg = error.response?.data?.msg || 
                    error.response?.data?.error || 
                    error.message || 
                    'An error occurred';

    toast.error(errorMsg);
    return Promise.reject(error);
  }
);

export default axiosInstance;

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, HTTP_STATUS, ERROR_MESSAGES } from '../config/constants';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS
});

// Request interceptor to add token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
      // Clear token and redirect to login (handled in app.js)
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userId');
    }
    return Promise.reject(error);
  }
);

// API service functions
export const apiService = {
  // Authentication
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/api/auth/login', {
        email,
        password
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: ERROR_MESSAGES.GENERIC_ERROR };
    }
  },

  register: async (userData) => {
    try {
      const response = await apiClient.post('/api/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: ERROR_MESSAGES.GENERIC_ERROR };
    }
  },

  // Properties
  searchProperties: async (params) => {
    try {
      const response = await apiClient.get('/api/properties/search', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: ERROR_MESSAGES.GENERIC_ERROR };
    }
  },

  getPropertyDetails: async (propertyId) => {
    try {
      const response = await apiClient.get(`/api/properties/${propertyId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: ERROR_MESSAGES.GENERIC_ERROR };
    }
  },

  getFeaturedProperties: async () => {
    try {
      const response = await apiClient.get('/api/properties/featured');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: ERROR_MESSAGES.GENERIC_ERROR };
    }
  },

  // Favorites
  getFavorites: async () => {
    try {
      const response = await apiClient.get('/api/favorites');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: ERROR_MESSAGES.GENERIC_ERROR };
    }
  },

  addFavorite: async (propertyId) => {
    try {
      const response = await apiClient.post(`/api/favorites/${propertyId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: ERROR_MESSAGES.GENERIC_ERROR };
    }
  },

  removeFavorite: async (propertyId) => {
    try {
      const response = await apiClient.delete(`/api/favorites/${propertyId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: ERROR_MESSAGES.GENERIC_ERROR };
    }
  },

  // Bookings
  getBookings: async () => {
    try {
      const response = await apiClient.get('/api/bookings');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: ERROR_MESSAGES.GENERIC_ERROR };
    }
  },

  createBooking: async (bookingData) => {
    try {
      const response = await apiClient.post('/api/bookings', bookingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: ERROR_MESSAGES.GENERIC_ERROR };
    }
  },

  cancelBooking: async (bookingId) => {
    try {
      const response = await apiClient.delete(`/api/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: ERROR_MESSAGES.GENERIC_ERROR };
    }
  },

  // User
  getUserProfile: async () => {
    try {
      const response = await apiClient.get('/api/users/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: ERROR_MESSAGES.GENERIC_ERROR };
    }
  },

  updateUserProfile: async (userData) => {
    try {
      const response = await apiClient.put('/api/users/me', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: ERROR_MESSAGES.GENERIC_ERROR };
    }
  },

  getPropertyStats: async () => {
    try {
      const response = await apiClient.get('/api/properties-stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: ERROR_MESSAGES.GENERIC_ERROR };
    }
  }
};

export default apiClient;

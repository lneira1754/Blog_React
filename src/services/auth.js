import api from './api';
import { jwtDecode } from 'jwt-decode';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/login', { email, password });
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/register', userData);
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/profile', profileData);
    return response.data;
  },
  
  isTokenValid: (token) => {
    if (!token) return false;
    
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  },
  getUserFromToken: (token) => {
    try {
      return jwtDecode(token);
    } catch (error) {
      return null;
    }
  }
};
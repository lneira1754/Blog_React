import api from './api';

export const usersService = {
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  updateUserRole: async (userId, newRole) => {
    const response = await api.put(`/users/${userId}/role`, { role: newRole });
    return response.data;
  },

  updateUserStatus: async (userId, isActive) => {
    const response = await api.put(`/users/${userId}/status`, { is_active: isActive });
    return response.data;
  }
};
import api from './api';

export const categoriesService = {
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  createCategory: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  updateCategory: async (id, categoryData) => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  deleteCategory: async (id) => {
    try {
      console.log(`🗑️ Eliminando categoría ID: ${id}`);
      const response = await api.delete(`/categories/${id}`);
      console.log('✅ Respuesta del backend:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error en deleteCategory:', error);
      console.error('Detalles del error:', error.response);
      throw error;
    }
  }
};
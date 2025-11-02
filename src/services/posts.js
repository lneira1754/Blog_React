import api from './api';

export const postsService = {
  getPosts: async () => {
    const response = await api.get('/posts');
    const posts = response.data;
    
    // Obtener contador de comentarios para cada post
    const postsWithCommentsCount = await Promise.all(
      posts.map(async (post) => {
        try {
          const commentsResponse = await api.get(`/posts/${post.id}/comments`);
          return {
            ...post,
            comments_count: commentsResponse.data.length
          };
        } catch (error) {
          console.error(`Error getting comments for post ${post.id}:`, error);
          return {
            ...post,
            comments_count: 0
          };
        }
      })
    );
    
    return postsWithCommentsCount;
  },

  getPost: async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  createPost: async (postData) => {
    const response = await api.post('/posts', postData);
    return response.data;
  },

  updatePost: async (id, postData) => {
    const response = await api.put(`/posts/${id}`, postData);
    return response.data;
  },

  deletePost: async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },

  getMyPosts: async () => {
    const response = await api.get('/my-posts');
    const posts = response.data;
    
    // También agregar contador para mis posts
    const postsWithCommentsCount = await Promise.all(
      posts.map(async (post) => {
        try {
          const commentsResponse = await api.get(`/posts/${post.id}/comments`);
          return {
            ...post,
            comments_count: commentsResponse.data.length
          };
        } catch (error) {
          console.error(`Error getting comments for post ${post.id}:`, error);
          return {
            ...post,
            comments_count: 0
          };
        }
      })
    );
    
    return postsWithCommentsCount;
  }
};
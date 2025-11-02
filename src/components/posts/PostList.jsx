import React, { useState, useEffect } from 'react';
import { postsService } from '../../services/posts';
import PostCard from './PostCard';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const toast = useRef(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await postsService.getPosts();
      setPosts(data);
    } catch (error) {
      setError('Error al cargar las publicaciones');
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (postId) => {
    navigate(`/posts/edit/${postId}`);
  };

  const handleDelete = async (postId) => {
    try {
      await postsService.deletePost(postId);
      setPosts(posts.filter(post => post.id !== postId));
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Publicación eliminada correctamente',
        life: 3000
      });
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo eliminar la publicación',
        life: 3000
      });
    }
  };

  const handleView = (postId) => {
    navigate(`/posts/${postId}`);
  };

  if (loading) return <Loading message="Cargando publicaciones..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <Toast ref={toast} />
        <div className="flex justify-content-between align-items-center mb-4">
          <h1>Publicaciones</h1>
          {isAuthenticated && (
            <Button 
              label="Crear Publicación" 
              icon="pi pi-plus" 
              onClick={() => navigate('/posts/create')}
            />
          )}
        </div>
      
      {posts.length === 0 ? (
        <div className="text-center p-4">
          <i className="pi pi-inbox text-6xl text-color-secondary mb-3"></i>
          <h3>No hay publicaciones</h3>
          <p className="text-color-secondary">Sé el primero en crear una publicación</p>
        </div>
      ) : (
        <div className="grid justify-content-start">
          {posts.map(post => (
            <div key={post.id} className="col-12 md:col-6 lg:col-4 p-2">
              <PostCard 
                post={post}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;
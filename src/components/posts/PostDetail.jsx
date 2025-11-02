import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postsService } from '../../services/posts';
import { commentsService } from '../../services/comments';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';
import CommentList from '../comments/CommentList';
import CommentForm from '../comments/CommentForm';
import { formatDate } from '../../utils/helpers';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const toast = useRef(null);

  useEffect(() => {
    loadPostAndComments();
  }, [id]);

  const loadPostAndComments = async () => {
    try {
      setLoading(true);
      const [postData, commentsData] = await Promise.all([
        postsService.getPost(id),
        commentsService.getComments(id)
      ]);
      setPost(postData);
      setComments(commentsData);
    } catch (error) {
      setError('Error al cargar el post');
      console.error('Error loading post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentAdded = () => {
    // Recargar comentarios después de agregar uno nuevo
    loadPostAndComments();
  };

  const handleBack = () => {
    navigate(-1); // Volver a la página anterior
  };

  if (loading) return <Loading message="Cargando post..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!post) return <ErrorMessage message="Post no encontrado" />;

  const header = (
    <div className="mb-4">
      <div className="flex align-items-center gap-2 text-color-secondary text-sm mb-2">
        <i className="pi pi-calendar"></i>
        <span>Publicado: {formatDate(post.created_at)}</span>
        
        {post.updated_at !== post.created_at && (
          <>
            <span className="mx-2">•</span>
            <i className="pi pi-refresh"></i>
            <span>Actualizado: {formatDate(post.updated_at)}</span>
          </>
        )}
      </div>
      
      {/* Título del post */}
      <h1 className="text-3xl font-bold mb-3">{post.title}</h1>
      
      {/*informacion del autor */}
      <div className="flex align-items-center gap-2 mb-2">
        <i className="pi pi-user text-color-secondary"></i>
        <span className="font-semibold">Por: {post.author}</span>
      </div>

      {/*categorias del post */}
      {post.categories && post.categories.length > 0 && (
        <div className="flex align-items-center gap-2 mb-3">
          <i className="pi pi-tags text-color-secondary"></i>
          <span className="font-semibold mr-2">Categorías:</span>
          <div className="flex flex-wrap gap-1">
            {post.categories.map(category => (
              <Tag
                key={category.id}
                value={category.name}
                className="mr-1"
              />
            ))}
          </div>
        </div>
      )}
      
      {/*contador de comentarios */}
      <div className="flex flex-wrap justify-content-between align-items-center gap-3">
        <div className="flex align-items-center gap-2">
          <Tag 
            value={`${comments.length} comentarios`} 
            icon="pi pi-comments"
            severity="info"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <Toast ref={toast} />
      
      <div className="mb-3">
        <Button 
          label="Volver" 
          icon="pi pi-arrow-left" 
          onClick={handleBack}
          text
        />
      </div>

      <Card 
        header={header}
        className="mb-4"
      >
        {/*contenido del post */}
        <div className="prose max-w-none">
          <p className="whitespace-pre-line text-lg leading-relaxed">
            {post.content}
          </p>
        </div>
      </Card>

      {/*seccion de comentarios*/}
      <div className="grid">
        <div className="col-12 lg:col-8">
          <CommentList 
            postId={id} 
            comments={comments}
            onCommentAdded={handleCommentAdded}
          />
        </div>
        <div className="col-12 lg:col-4">
          {user ? (
            <CommentForm 
              postId={id} 
              onCommentAdded={handleCommentAdded}
            />
          ):(
            <Card className="text-center">
              <i className="pi pi-user text-4xl text-color-secondary mb-3"></i>
              <h3>Inicia sesión para comentar</h3>
              <p className="text-color-secondary mb-3">
                Debes estar registrado para agregar comentarios
              </p>
              <Button 
                label="Iniciar Sesión" 
                icon="pi pi-sign-in"
                onClick={() => navigate('/login')}
              />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
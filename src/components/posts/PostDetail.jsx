import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postsService } from '../../services/posts';
import { commentsService } from '../../services/comments';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
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
    loadPostAndComments();
  };

  const handleBack = () => {
    navigate(-1);
  };

  const confirmDelete = () => {
    confirmDialog({
      message: '¿Estás seguro de que quieres eliminar esta publicación? Esta acción no se puede deshacer.',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: handleDelete,
      reject: () => {}
    });
  };

  const handleDelete = async () => {
    try {
      await postsService.deletePost(id);
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Publicación eliminada correctamente',
        life: 3000
      });
      navigate('/posts');
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo eliminar la publicación',
        life: 3000
      });
    }
  };

  if (loading) return <Loading message="Cargando post..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!post) return <ErrorMessage message="Post no encontrado" />;

  // Verificar permisos para acciones
  const canEdit = user && post.author_id === user.id;
  const canDelete = user && (user.role === 'admin' || post.author_id === user.id);

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
      
      <h1 className="text-3xl font-bold mb-3">{post.title}</h1>
      
      <div className="flex align-items-center gap-2 mb-2">
        <i className="pi pi-user text-color-secondary"></i>
        <span className="font-semibold">Por: {post.author}</span>
      </div>

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
    </div>
  );

  return (
    <div>
      <Toast ref={toast} />
      <ConfirmDialog />
      
      <div className="flex justify-content-between align-items-center mb-3">
        <Button 
          label="Volver" 
          icon="pi pi-arrow-left" 
          onClick={handleBack}
          text
        />
        
        {/* Botones de acción - solo para autor o admin */}
        {(canEdit || canDelete) && (
          <div className="flex gap-2">
            {canEdit && (
              <Button 
                label="Editar" 
                icon="pi pi-pencil" 
                onClick={() => navigate(`/posts/edit/${post.id}`)}
                severity="secondary"
              />
            )}
            {canDelete && (
              <Button 
                label="Eliminar" 
                icon="pi pi-trash" 
                onClick={confirmDelete}
                severity="danger"
              />
            )}
          </div>
        )}
      </div>

      <Card 
        header={header}
        className="mb-4"
      >
        <div className="prose max-w-none">
          <p className="whitespace-pre-line text-lg leading-relaxed">
            {post.content}
          </p>
        </div>
      </Card>
      

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
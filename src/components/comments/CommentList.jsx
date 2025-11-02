import React, { useState, useEffect } from 'react';
import { commentsService } from '../../services/comments';
import CommentCard from './CommentCard';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const toast = useRef(null);

  useEffect(() => {
    loadComments();
  }, [postId]);
  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await commentsService.getComments(postId);
      setComments(data);
    } catch (error) {
      setError('Error al cargar los comentarios');
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (commentId) => {
    try {
      await commentsService.deleteComment(commentId);
      setComments(comments.filter(comment => comment.id !== commentId));
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Comentario eliminado correctamente',
        life: 3000
      });
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo eliminar el comentario',
        life: 3000
      });
    }
  };
  if (loading) return <Loading message="Cargando comentarios..." />;
  if (error) return <ErrorMessage message={error} />;
  return (
    <div>
      <Toast ref={toast} />
      <div className="mb-3">
        <h3>Comentarios ({comments.length})</h3>
      </div>
      {comments.length === 0 ? (
        <div className="text-center p-4 border-round border-1 surface-border">
          <i className="pi pi-comments text-4xl text-color-secondary mb-2"></i>
          <p className="text-color-secondary m-0">No hay comentarios aún</p>
        </div>
      ) : (
        <div>
          {comments.map(comment => (
            <CommentCard 
              key={comment.id}
              comment={comment}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default CommentList;
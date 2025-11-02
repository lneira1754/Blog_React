import React, { useState } from 'react';
import { commentsService } from '../../services/comments';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const CommentForm = ({ postId, onCommentAdded }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const toast = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!text.trim()) {
      toast.current.show({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'El comentario no puede estar vacío',
        life: 3000
      });
      return;
    }

    setLoading(true);

    try {
      await commentsService.createComment(postId, { 
        text: text.trim(),
        post_id: parseInt(postId)  // Asegurar que sea número
      });
      
      setText('');
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Comentario agregado correctamente',
        life: 3000
      });
      
      if (onCommentAdded) {
        onCommentAdded(); // Recargar la lista de comentarios
      }
    } catch (error) {
      console.error('Error creating comment:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.response?.data?.error || 'Error al agregar el comentario',
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Card title="Agregar Comentario">
        <div className="text-center p-3">
          <p className="text-color-secondary mb-3">
            Debes iniciar sesión para comentar
          </p>
          <Button 
            label="Iniciar Sesión" 
            onClick={() => window.location.href = '/login'}
          />
        </div>
      </Card>
    );
  }

  return (
    <div>
      <Toast ref={toast} />
      
      <Card title="Agregar Comentario">
        <form onSubmit={handleSubmit}>
          <div className="field mb-3">
            <InputTextarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escribe tu comentario..."
              rows={4}
              className="w-full"
              autoResize
            />
          </div>

          <div className="flex justify-content-end">
            <Button 
              type="submit" 
              label="Agregar Comentario" 
              loading={loading}
              icon="pi pi-send"
              disabled={!text.trim()}
            />
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CommentForm;
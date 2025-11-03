import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { confirmDialog } from 'primereact/confirmdialog';
import { useAuth } from '../../contexts/AuthContext';
import { formatDate } from '../../utils/helpers';

const PostCard = ({ post, onEdit, onDelete, onView }) => {
  const { user } = useAuth();
  
  // Solo el autor puede editar
  const canEdit = post.author_id === user?.id;
  
  // Solo el autor o admin pueden eliminar (NO moderador)
  const canDelete = user?.role === 'admin' || post.author_id === user?.id;

  const confirmDelete = () => {
    confirmDialog({
      message: '¿Estás seguro de eliminar esta publicación? Esta acción no se puede deshacer.',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: () => onDelete(post.id),
      reject: () => {}
    });
  };

  const footer = (
    <div className="flex justify-content-between align-items-center">
      <div className="flex gap-2">
        <Button 
          label="Ver Más" 
          icon="pi pi-eye" 
          onClick={() => onView(post.id)}
          outlined
        />
        {canEdit && (
          <Button 
            label="Editar" 
            icon="pi pi-pencil" 
            onClick={() => onEdit(post.id)}
            severity="secondary"
            outlined
          />
        )}
        {canDelete && (
          <Button 
            label="Eliminar" 
            icon="pi pi-trash" 
            onClick={confirmDelete}
            severity="danger"
            outlined
          />
        )}
      </div>
      <small className="text-color-secondary">
        {formatDate(post.created_at)}
      </small>
    </div>
  );

  return (
    <Card 
      title={post.title}
      subTitle={`Por: ${post.author}`}
      footer={footer}
      className="mb-3 h-full shadow-2 hover:shadow-4 transition-all transition-duration-300"
    >
      <div className="flex flex-column h-full">
        {/* Contenido del post */}
        <p className="line-clamp-3 mb-3 flex-grow-1">{post.content}</p>
        
        {/* Categorías del post */}
        {post.categories && post.categories.length > 0 && (
          <div className="mb-3">
            <div className="flex align-items-center gap-2 mb-2">
              <i className="pi pi-tags text-color-secondary text-sm"></i>
              <small className="text-color-secondary font-semibold">Categorías:</small>
            </div>
            <div className="flex flex-wrap gap-1">
              {post.categories.map((category, index) => (
                <Tag 
                  key={index} 
                  value={category.name} 
                  className="text-xs" 
                  severity="info"
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Información del post */}
        <div className="flex flex-wrap gap-2 mt-auto">
          <Tag 
            value={`${post.comments_count || 0} comentarios`} 
            icon="pi pi-comments"
            severity="info"
            className="text-sm"
          />
        </div>
      </div>
    </Card>
  );
};

export default PostCard;
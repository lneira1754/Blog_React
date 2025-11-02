import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { confirmDialog } from 'primereact/confirmdialog';
import { useAuth } from '../../contexts/AuthContext';
import { formatDate } from '../../utils/helpers';

const CommentCard = ({ comment, onDelete }) => {
  const { user } = useAuth();
  const canDelete = user?.role === 'admin' || 
                   user?.role === 'moderator' || 
                   comment.author_id === user?.id;
  const confirmDelete = () => {
    confirmDialog({
      message: '¿Estás seguro de eliminar este comentario?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: () => onDelete(comment.id),
      rejectClassName: 'p-button-secondary'
    });
  };
  const footer = (
    <div className="flex justify-content-between align-items-center">
      <small className="text-color-secondary">
        {formatDate(comment.created_at)}
      </small>
      {canDelete && (
        <Button 
          label="Eliminar" 
          icon="pi pi-trash" 
          onClick={confirmDelete}
          severity="danger"
          size="small"
          outlined
        />
      )}
    </div>
  );
  return (
    <Card 
      subTitle={`Por: ${comment.author}`}
      footer={footer}
      className="mb-2"
    >
      <p className="m-0">{comment.text}</p>
    </Card>
  );
};
export default CommentCard;
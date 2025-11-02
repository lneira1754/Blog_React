import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

const Loading = ({ message = "Cargando..." }) => {
  return (
    <div className="flex flex-column align-items-center justify-content-center p-4">
      <ProgressSpinner style={{ width: '50px', height: '50px' }} />
      <p className="mt-2 text-color-secondary">{message}</p>
    </div>
  );
};
export default Loading;
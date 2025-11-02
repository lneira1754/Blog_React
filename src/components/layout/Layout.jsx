import React from 'react';
import Navbar from './Navbar';
import { Toast } from 'primereact/toast';
import { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const toast = useRef(null);
  const location = useLocation();
  useEffect(() => {
    if (location.state?.message) {
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: location.state.message,
        life: 3000
      });
      //limpiar el estado de navegación
      window.history.replaceState({}, document.title);
    }
  }, [location]);
  return (
    <div className="min-h-screen flex flex-column">
      <Toast ref={toast} />
      <Navbar />
      <main className="flex-1 p-3">
        <div className="container">
          {children}
        </div>
      </main>
      <footer className="surface-ground p-3 text-center text-color-secondary">
        <p>MiniBlog &copy; 2025 - Todos los derechos reservados EFI JS React y Vite</p>
      </footer>
    </div>
  );
};
export default Layout;
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin, isModerator } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const start = (
    <Link to="/" className="flex align-items-center no-underline text-color">
      <i className="pi pi-bookmark text-2xl mr-2"></i>
      <span className="font-bold text-xl">MiniBlog</span>
    </Link>
  );
  const end = isAuthenticated ? (
    <div className="flex align-items-center gap-3">
      <Badge 
        value={user?.role} 
        severity={
          user?.role === 'admin' ? 'danger' : 
          user?.role === 'moderator' ? 'warning' : 'success'
        }
      />
      <span className="text-color">Hola, {user?.username}</span>

        <Button 
          icon="pi pi-user" 
          onClick={() => navigate('/profile')}
          severity="secondary"
          outlined
          tooltip="Mi Perfil"
          tooltipOptions={{ position: 'bottom' }}
      />

      <Button 
        label="Cerrar Sesión" 
        icon="pi pi-sign-out" 
        onClick={handleLogout}
        severity="secondary"
        outlined
      />
    </div>
  ) : (
    <div className="flex gap-2">
      <Link to="/login">
        <Button label="Iniciar Sesión" text />
      </Link>
      <Link to="/register">
        <Button label="Registrarse" outlined />
      </Link>
    </div>
  );
  const items = isAuthenticated ? [
    {
      label: 'Inicio',
      icon: 'pi pi-home',
      command: () => navigate('/')
    },
    {
      label: 'Publicaciones',
      icon: 'pi pi-file',
      items: [
        {
          label: 'Ver Todas',
          icon: 'pi pi-list',
          command: () => navigate('/posts')
        },
        {
          label: 'Mis Publicaciones',
          icon: 'pi pi-user',
          command: () => navigate('/my-posts')
        },
        {
          label: 'Crear Publicación',
          icon: 'pi pi-plus',
          command: () => navigate('/posts/create')
        }
      ]
    },
    ...(isModerator ? [{
      label: 'Administración',
      icon: 'pi pi-cog',
      items: [
        ...(isAdmin ? [{
          label: 'Usuarios',
          icon: 'pi pi-users',
          command: () => navigate('/admin/users')
        }] : []),
        {
      label: 'Categorías',
      icon: 'pi pi-tags',
      command: () => navigate('/admin/categories')
        },
        {
          label: 'Estadísticas',
          icon: 'pi pi-chart-bar',
          command: () => navigate('/stats')
        }
      ]
    }] : [])
  ] : [
    {
      label: 'Inicio',
      icon: 'pi pi-home',
      command: () => navigate('/')
    },
    {
      label: 'Publicaciones',
      icon: 'pi pi-file',
      items: [
        {
          label: 'Ver Todas',
          icon: 'pi pi-list',
          command: () => navigate('/posts')
        }
      ]
    }
  ];
  return (
    <div className="shadow-2 surface-card">
      <Menubar 
        model={items} 
        start={start} 
        end={end}
        className="border-none border-round-none"
      />
    </div>
  );
};
export default Navbar;
import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/auth';
import { useRef } from 'react';
import Loading from '../common/Loading';
import { formatDate } from '../../utils/helpers';

const Profile = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useRef(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profileData = await authService.getProfile();
      setProfile(profileData);
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al cargar el perfil',
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleSeverity = (role) => {
    switch (role) {
      case 'admin': return 'danger';
      case 'moderator': return 'warning';
      case 'user': return 'success';
      default: return 'secondary';
    }
  };

  const getStatusSeverity = (isActive) => {
    return isActive ? 'success' : 'danger';
  };

  if (loading) return <Loading message="Cargando perfil..." />;
  if (!profile) return <div>Error al cargar el perfil</div>;

  return (
    <div>
      <Toast ref={toast} />
      
      <div className="grid">
        <div className="col-12 md:col-8">
          <Card title="Mi Perfil">
            <div className="grid">
              <div className="col-12 md:col-6">
                <div className="field mb-4">
                  <label className="block mb-2 font-semibold">Usuario</label>
                  <p className="text-lg font-semibold">{profile.username}</p>
                </div>
              </div>
              
              <div className="col-12 md:col-6">
                <div className="field mb-4">
                  <label className="block mb-2 font-semibold">Email</label>
                  <p className="text-lg font-semibold">{profile.email}</p>
                </div>
              </div>

              <div className="col-12 md:col-6">
                <div className="field mb-4">
                  <label className="block mb-2 font-semibold">Rol</label>
                  <Tag 
                    value={profile.role} 
                    severity={getRoleSeverity(profile.role)}
                    className="text-lg"
                  />
                </div>
              </div>

              <div className="col-12 md:col-6">
                <div className="field mb-4">
                  <label className="block mb-2 font-semibold">Estado</label>
                  <Tag 
                    value={profile.is_active ? 'Activo' : 'Inactivo'} 
                    severity={getStatusSeverity(profile.is_active)}
                    className="text-lg"
                  />
                </div>
              </div>

              <div className="col-12">
                <div className="field mb-4">
                  <label className="block mb-2 font-semibold">Miembro desde</label>
                  <p className="text-lg">
                    {profile.created_at ? formatDate(profile.created_at) : 'Fecha no disponible'}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="col-12 md:col-4">
          <Card title="Estadísticas Personales" className="h-full">
            <div className="flex flex-column gap-3 text-center">
              <div className="p-3 border-round bg-blue-50">
                <i className="pi pi-file text-4xl text-blue-500 mb-2"></i>
                <h3 className="text-2xl font-bold mb-1">0</h3>
                <p className="text-color-secondary">Posts Publicados</p>
              </div>
              
              <div className="p-3 border-round bg-green-50">
                <i className="pi pi-comments text-4xl text-green-500 mb-2"></i>
                <h3 className="text-2xl font-bold mb-1">0</h3>
                <p className="text-color-secondary">Comentarios</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
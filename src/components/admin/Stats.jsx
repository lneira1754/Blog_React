import React, { useState, useEffect } from 'react';
import { statsService } from '../../services/stats';
import { Card } from 'primereact/card';
import { ProgressBar } from 'primereact/progressbar';
import { Skeleton } from 'primereact/skeleton';
import { Tag } from 'primereact/tag';
import { useAuth } from '../../contexts/AuthContext'; // ← Asegúrate de tener este import

const Stats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth(); // ← Agregar esto

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      console.log('Cargando estadísticas...');
      const statsData = await statsService.getStats();
      console.log('Datos recibidos:', statsData);
      
      // Convertir objetos a arrays para el frontend
      const processedStats = {
        ...statsData,
        posts_by_category: statsData.posts_by_category ? 
          Object.entries(statsData.posts_by_category).map(([name, count]) => ({ name, count })) : [],
        users_by_role: statsData.users_by_role ? 
          Object.entries(statsData.users_by_role).map(([role, count]) => ({ role, count })) : []
      };
      
      console.log('Datos procesados:', processedStats);
      setStats(processedStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="col-12 md:col-6 lg:col-4">
            <Card className="m-2">
              <Skeleton width="100%" height="120px" />
            </Card>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Estadísticas</h1>
      
      <div className="grid">
        {/* Total de Usuarios */}
        <div className="col-12 md:col-6 lg:col-4">
          <Card className="text-center shadow-2">
            <div className="flex flex-column align-items-center">
              <i className="pi pi-users text-6xl text-blue-500 mb-3"></i>
              <h3 className="text-2xl font-bold mb-2">{stats?.total_users || 0}</h3>
              <p className="text-color-secondary">Total Usuarios</p>
            </div>
          </Card>
        </div>

        {/* Total de Posts */}
        <div className="col-12 md:col-6 lg:col-4">
          <Card className="text-center shadow-2">
            <div className="flex flex-column align-items-center">
              <i className="pi pi-file text-6xl text-green-500 mb-3"></i>
              <h3 className="text-2xl font-bold mb-2">{stats?.total_posts || 0}</h3>
              <p className="text-color-secondary">Total Posts</p>
            </div>
          </Card>
        </div>

        {/* Total de Comentarios */}
        <div className="col-12 md:col-6 lg:col-4">
          <Card className="text-center shadow-2">
            <div className="flex flex-column align-items-center">
              <i className="pi pi-comments text-6xl text-purple-500 mb-3"></i>
              <h3 className="text-2xl font-bold mb-2">{stats?.total_comments || 0}</h3>
              <p className="text-color-secondary">Total Comentarios</p>
            </div>
          </Card>
        </div>

        {/* Posts de la última semana - SOLO PARA ADMIN */}
        {isAdmin && stats?.posts_last_week !== undefined && (
          <div className="col-12 md:col-6 lg:col-4">
            <Card className="text-center shadow-2">
              <div className="flex flex-column align-items-center">
                <i className="pi pi-calendar-plus text-6xl text-orange-500 mb-3"></i>
                <h3 className="text-2xl font-bold mb-2">{stats.posts_last_week}</h3>
                <p className="text-color-secondary">Posts esta semana</p>
                <small className="text-color-secondary mt-1">
                  Últimos 7 días
                </small>
              </div>
            </Card>
          </div>
        )}

        {/* Posts por Categoría */}
        {stats?.posts_by_category && stats.posts_by_category.length > 0 && (
          <div className="col-12 lg:col-6">
            <Card title="Posts por Categoría" className="shadow-2">
              {stats.posts_by_category.map((category, index) => (
                <div key={index} className="mb-3">
                  <div className="flex justify-content-between mb-2">
                    <span>{category.name}</span>
                    <Tag value={category.count} severity="info" />
                  </div>
                  <ProgressBar 
                    value={(category.count / stats.total_posts) * 100} 
                    showValue={false}
                  />
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* Usuarios por Rol */}
        {stats?.users_by_role && stats.users_by_role.length > 0 && (
          <div className="col-12 lg:col-6">
            <Card title="Usuarios por Rol" className="shadow-2">
              {stats.users_by_role.map((role, index) => (
                <div key={index} className="mb-3">
                  <div className="flex justify-content-between mb-2">
                    <span className="capitalize">{role.role}</span>
                    <Tag value={role.count} severity="success" />
                  </div>
                  <ProgressBar 
                    value={(role.count / stats.total_users) * 100} 
                    showValue={false}
                  />
                </div>
              ))}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stats;
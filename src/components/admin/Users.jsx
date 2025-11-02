import React, { useState, useEffect } from 'react';
import { usersService } from '../../services/users';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { Card } from 'primereact/card';
import { useRef } from 'react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useRef(null);

  const roles = [
    { label: 'Usuario', value: 'user' },
    { label: 'Moderador', value: 'moderator' },
    { label: 'Administrador', value: 'admin' }
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      console.log('Cargando usuarios...');
      const usersData = await usersService.getUsers();
      console.log('Usuarios recibidos:', usersData);
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
      console.error('Error details:', error.response);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al cargar los usuarios',
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
      case 'user': return 'info';
      default: return 'secondary';
    }
  };

  const getStatusSeverity = (isActive) => {
    return isActive ? 'success' : 'danger';
  };

  const getStatusLabel = (isActive) => {
    return isActive ? 'Activo' : 'Inactivo';
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await usersService.updateUserRole(userId, newRole);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Rol actualizado correctamente',
        life: 3000
      });
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al actualizar el rol',
        life: 3000
      });
    }
  };

  const handleStatusChange = async (userId, isActive) => {
    // Reemplazar confirmDialog con window.confirm
    const confirmed = window.confirm(
      `¿Estás seguro de ${isActive ? 'activar' : 'desactivar'} este usuario?`
    );
    
    if (confirmed) {
      try {
        await usersService.updateUserStatus(userId, isActive);
        setUsers(users.map(user => 
          user.id === userId ? { ...user, is_active: isActive } : user
        ));
        toast.current.show({
          severity: 'success',
          summary: 'Éxito',
          detail: `Usuario ${isActive ? 'activado' : 'desactivado'} correctamente`,
          life: 3000
        });
      } catch (error) {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cambiar el estado del usuario',
          life: 3000
        });
      }
    }
  };

  const roleBodyTemplate = (rowData) => {
    return (
      <Dropdown
        value={rowData.role}
        options={roles}
        onChange={(e) => handleRoleChange(rowData.id, e.value)}
        placeholder="Seleccionar Rol"
        className="w-full md:w-10rem"
      />
    );
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag 
        value={getStatusLabel(rowData.is_active)} 
        severity={getStatusSeverity(rowData.is_active)}
      />
    );
  };

  const actionsBodyTemplate = (rowData) => {
    return (
      <Button
        label={rowData.is_active ? 'Desactivar' : 'Activar'}
        icon={rowData.is_active ? 'pi pi-ban' : 'pi pi-check'}
        severity={rowData.is_active ? 'danger' : 'success'}
        outlined
        size="small"
        onClick={() => handleStatusChange(rowData.id, !rowData.is_active)}
      />
    );
  };

  return (
    <div>
      <Toast ref={toast} />
      <div className="flex justify-content-between align-items-center mb-4">
        <h1>Gestión de Usuarios</h1>
        <Button 
          label="Actualizar" 
          icon="pi pi-refresh" 
          onClick={loadUsers}
          outlined
        />
      </div>

      <Card>
        <DataTable
          value={users}
          loading={loading}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} usuarios"
          emptyMessage="No se encontraron usuarios"
        >
          <Column field="username" header="Usuario" sortable />
          <Column field="email" header="Email" sortable />
          <Column field="role" header="Rol" body={roleBodyTemplate} sortable />
          <Column field="is_active" header="Estado" body={statusBodyTemplate} sortable />
          <Column header="Acciones" body={actionsBodyTemplate} />
        </DataTable>
      </Card>
    </div>
  );
};

export default Users;
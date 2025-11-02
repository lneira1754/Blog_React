import React, { useState, useEffect } from 'react';
import { categoriesService } from '../../services/categories';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { confirmDialog } from 'primereact/confirmdialog';
import { Card } from 'primereact/card';
import { useAuth } from '../../contexts/AuthContext';
import { useRef } from 'react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '' });
  const toast = useRef(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const categoriesData = await categoriesService.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al cargar las categorías',
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setFormData({ name: '' });
    setShowDialog(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name });
    setShowDialog(true);
  };

  const handleDelete = async (category) => {
    console.log('🎯 handleDelete ejecutado para:', category.name);
    
    // Usar window.confirm temporalmente para debugging
    const confirmed = window.confirm(`¿Estás seguro de eliminar la categoría "${category.name}"?`);
    
    if (confirmed) {
        try {
        console.log('✅ Usuario confirmó eliminación');
        await categoriesService.deleteCategory(category.id);
        setCategories(categories.filter(cat => cat.id !== category.id));
        toast.current.show({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Categoría eliminada correctamente',
            life: 3000
        });
        } catch (error) {
        console.error('Error deleting category:', error);
        toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: error.response?.data?.error || 'Error al eliminar la categoría',
            life: 3000
        });
        }
    } else {
        console.log('❌ Usuario canceló eliminación');
    }
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'El nombre de la categoría es requerido',
        life: 3000
      });
      return;
    }

    try {
      if (editingCategory) {
        const updatedCategory = await categoriesService.updateCategory(editingCategory.id, formData);
        setCategories(categories.map(cat => 
          cat.id === editingCategory.id ? updatedCategory : cat
        ));
        toast.current.show({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Categoría actualizada correctamente',
          life: 3000
        });
      } else {
        const newCategory = await categoriesService.createCategory(formData);
        setCategories([...categories, newCategory]);
        toast.current.show({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Categoría creada correctamente',
          life: 3000
        });
      }
      
      setShowDialog(false);
      setFormData({ name: '' });
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.response?.data?.error || 'Error al guardar la categoría',
        life: 3000
      });
    }
  };

  // CORREGIDO: actionsBodyTemplate bien definida
  const actionsBodyTemplate = (rowData) => {
    console.log('🔧 Renderizando acciones para:', rowData.name);
    return (
      <div className="flex gap-2">
        <Button 
          icon="pi pi-pencil" 
          severity="secondary" 
          size="small"
          outlined
          onClick={() => {
            console.log('✏️ Editando:', rowData.name);
            handleEdit(rowData);
          }}
          tooltip="Editar categoría"
        />
        {isAdmin && (
          <Button 
            icon="pi pi-trash" 
            severity="danger" 
            size="small"
            outlined
            onClick={() => {
              console.log('🗑️ Intentando eliminar:', rowData.name);
              handleDelete(rowData);
            }}
            tooltip="Eliminar categoría"
          />
        )}
      </div>
    );
  };

  const dialogFooter = (
    <div>
      <Button 
        label="Cancelar" 
        icon="pi pi-times" 
        onClick={() => setShowDialog(false)} 
        severity="secondary"
        outlined
      />
      <Button 
        label={editingCategory ? 'Actualizar' : 'Crear'} 
        icon="pi pi-check" 
        onClick={handleSubmit}
        className="ml-2"
      />
    </div>
  );

  return (
    <div>
      <Toast ref={toast} />
      
      <div className="flex justify-content-between align-items-center mb-4">
        <h1>Gestión de Categorías</h1>
        <Button 
          label="Nueva Categoría" 
          icon="pi pi-plus" 
          onClick={handleCreate}
        />
      </div>

      <Card>
        <DataTable
          value={categories}
          loading={loading}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} categorías"
          emptyMessage="No se encontraron categorías"
        >
          <Column field="id" header="ID" sortable style={{ width: '80px' }} />
          <Column field="name" header="Nombre" sortable />
          <Column 
            header="Acciones" 
            body={actionsBodyTemplate} 
            style={{ width: '120px' }} 
          />
        </DataTable>
      </Card>

      <Dialog 
        header={editingCategory ? 'Editar Categoría' : 'Crear Categoría'} 
        visible={showDialog} 
        style={{ width: '500px' }}
        footer={dialogFooter}
        onHide={() => setShowDialog(false)}
      >
        <form onSubmit={handleSubmit} className="p-fluid">
          <div className="field mb-3">
            <label htmlFor="name" className="block mb-2 font-semibold">
              Nombre de la categoría
            </label>
            <InputText
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ name: e.target.value })}
              placeholder="Ingresa el nombre de la categoría"
              className="w-full"
              autoFocus
            />
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default Categories;
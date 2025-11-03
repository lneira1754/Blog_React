import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postsService } from '../../services/posts';
import { categoriesService } from '../../services/categories';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { MultiSelect } from 'primereact/multiselect';
import { useRef } from 'react';
import Loading from '../common/Loading';

const PostForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categories: [],
    is_published: true
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useRef(null);
  const isEditing = !!id;

  useEffect(() => {
    loadCategories();
    if (isEditing) {
      loadPost();
    }
  }, [id]);

  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);
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
      setCategoriesLoading(false);
    }
  };

  const loadPost = async () => {
    try {
      setLoading(true);
      const post = await postsService.getPost(id);
      setFormData({
        title: post.title,
        content: post.content,
        categories: post.categories || [],
        is_published: post.is_published
      });
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al cargar la publicación',
        life: 3000
      });
      navigate('/posts');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCategoriesChange = (e) => {
    setFormData(prev => ({
      ...prev,
      categories: e.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEditing) {
        await postsService.updatePost(id, formData);
        toast.current.show({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Publicación actualizada correctamente',
          life: 3000
        });
      } else {
        await postsService.createPost(formData);
        toast.current.show({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Publicación creada correctamente',
          life: 3000
        });
      }
      navigate('/posts');
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.response?.data?.error || 'Error al guardar la publicación',
        life: 3000
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading message="Cargando publicación..." />;

  return (
    <div>
      <Toast ref={toast} />
      <Card title={isEditing ? 'Editar Publicación' : 'Crear Publicación'}>
        <form onSubmit={handleSubmit} className="p-fluid">
          <div className="field mb-3">
            <label htmlFor="title" className="block mb-2 font-semibold">
              Título
            </label>
            <InputText
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ingresa el título de la publicación"
              required
              className="w-full"
            />
          </div>

          <div className="field mb-3">
            <label htmlFor="categories" className="block mb-2 font-semibold">
              Categorías
            </label>
            <MultiSelect
              id="categories"
              value={formData.categories}
              onChange={handleCategoriesChange}
              options={categories}
              optionLabel="name"
              optionValue="id"
              placeholder="Selecciona las categorías"
              loading={categoriesLoading}
              className="w-full"
            />
          </div>

          <div className="field mb-3">
            <label htmlFor="content" className="block mb-2 font-semibold">
              Contenido
            </label>
            <InputTextarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Escribe el contenido de tu publicación..."
              rows={10}
              required
              className="w-full"
            />
          </div>

          <div className="field mb-3">
            <div className="flex align-items-center">
              <input
                type="checkbox"
                id="is_published"
                name="is_published"
                checked={formData.is_published}
                onChange={handleChange}
                className="mr-2"
              />
              {/* Intento de hacer borradores de publicaciones, no esta terminado (no funciona) */}
              <label htmlFor="is_published" className="font-semibold">
                Publicar inmediatamente
              </label>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              type="submit" 
              label={isEditing ? 'Actualizar' : 'Crear'} 
              loading={saving}
              icon={isEditing ? 'pi pi-check' : 'pi pi-plus'}
            />
            <Button 
              type="button"
              label="Cancelar" 
              severity="secondary"
              onClick={() => navigate('/posts')}
              outlined
            />
          </div>
        </form>
      </Card>
    </div>
  );
};

export default PostForm;
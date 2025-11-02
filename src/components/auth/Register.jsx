import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';
import { Divider } from 'primereact/divider';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await register(formData);
      
      if (result.success) {
        navigate('/login', { 
          state: { 
            message: 'Usuario registrado exitosamente. Ahora puedes iniciar sesión.' 
          } 
        });
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Error en registro:', error);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-content-center align-items-center min-h-screen">
      <Card className="w-full md:w-4" title="Crear Cuenta">
        <form onSubmit={handleSubmit} className="p-fluid">
          {error && <Message severity="error" text={error} className="mb-3" />}
          
          <div className="field mb-3">
            <label htmlFor="username" className="block mb-2 font-semibold">
              Nombre de Usuario
            </label>
            <InputText
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Ingresa tu nombre de usuario"
              required
              className="w-full"
              minLength={3}
              maxLength={100}
            />
          </div>

          <div className="field mb-3">
            <label htmlFor="email" className="block mb-2 font-semibold">
              Email
            </label>
            <InputText
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              required
              className="w-full"
            />
          </div>

          <div className="field mb-3">
            <label htmlFor="password" className="block mb-2 font-semibold">
              Contraseña
            </label>
            <Password
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Ingresa tu contraseña"
              toggleMask
              className="w-full"
              required
              minLength={6}
              feedback={false}
            />
          </div>

          <div className="field mb-3">
            <div className="p-3 surface-100 border-round">
              <small className="text-color-secondary">
                <strong>Nota:</strong> Todos los nuevos usuarios se registran con rol "Usuario". 
                Los administradores pueden cambiar roles posteriormente.
              </small>
            </div>
          </div>

          <Button 
            type="submit" 
            label="Registrarse" 
            loading={loading}
            className="w-full mb-3"
          />

          <Divider />

          <div className="text-center">
            <span className="text-color-secondary">¿Ya tienes cuenta? </span>
            <Link to="/login" className="text-primary font-semibold no-underline">
              Inicia sesión aquí
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Register;
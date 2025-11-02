import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';
import { Divider } from 'primereact/divider';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };
  return (
    <div className="flex justify-content-center align-items-center min-h-screen">
      <Card className="w-full md:w-4" title="Iniciar Sesión">
        <form onSubmit={handleSubmit} className="p-fluid">
          {error && <Message severity="error" text={error} className="mb-3" />}
          <div className="field mb-3">
            <label htmlFor="email" className="block mb-2">Email</label>
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
            <label htmlFor="password" className="block mb-2">Contraseña</label>
            <Password
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Ingresa tu contraseña"
              feedback={false}
              toggleMask
              className="w-full"
              required
            />
          </div>
          <Button 
            type="submit" 
            label="Iniciar Sesión" 
            loading={loading}
            className="w-full mb-3"
          />
          <Divider />
          <div className="text-center">
            <span className="text-color-secondary">¿No tienes cuenta? </span>
            <Link to="/register" className="text-primary font-semibold no-underline">
              Regístrate aquí
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
};
export default Login;
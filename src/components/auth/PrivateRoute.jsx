import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../common/Loading';

const PrivateRoute = ({ children, requiredRole, requiredRoles }) => {
  const { isAuthenticated, user, loading, isAdmin } = useAuth();
  
  if (loading) {
    return <Loading />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Si se especifica un rol requerido
  if (requiredRole) {
    // Admin puede acceder a todo
    if (isAdmin) {
      return children;
    }
    
    // Verificar si el usuario tiene el rol requerido
    if (user.role !== requiredRole) {
      return <Navigate to="/" replace />;
    }
  }
  
  // Si se especifican múltiples roles permitidos
  if (requiredRoles && Array.isArray(requiredRoles)) {
    if (isAdmin) {
      return children;
    }
    
    if (!requiredRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
  }
  
  return children;
};

export default PrivateRoute;
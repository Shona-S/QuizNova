import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    const isAdminRoute = allowedRoles && allowedRoles.includes('ROLE_ADMIN');
    return <Navigate to={isAdminRoute ? "/admin/login" : "/login"} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'ROLE_ADMIN' ? "/admin/dashboard" : "/user/dashboard"} replace />;
  }

  return children;
};

export default ProtectedRoute;

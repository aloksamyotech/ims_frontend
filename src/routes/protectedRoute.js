import React from 'react';
import { Navigate } from 'react-router-dom';

const getPermissionsArray = () => {
  const stored = localStorage.getItem('permissions') || '';
  return stored.split(',').map(p => p.trim());
};

const ProtectedRoute = ({ requiredPermission, children }) => {
  const role = localStorage.getItem('role');
  const userPermissions = getPermissionsArray();

  if (role === 'user') {
    return children;
  }

  if (role === 'employee') {
    if (!requiredPermission || userPermissions.includes(requiredPermission)) {
      return children;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;

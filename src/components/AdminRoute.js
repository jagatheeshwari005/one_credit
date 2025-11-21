import React from 'react';
import ProtectedRoute from './ProtectedRoute';

// Simple wrapper that enforces adminOnly via ProtectedRoute
const AdminRoute = ({ children }) => {
  return (
    <ProtectedRoute adminOnly={true}>
      {children}
    </ProtectedRoute>
  );
};

export default AdminRoute;

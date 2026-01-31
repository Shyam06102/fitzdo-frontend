import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAuthToken } from '../utils/auth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

export { ProtectedRoute,PublicRoute };
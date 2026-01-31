import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuthToken, getCurrentUser, logout as logoutService } from '../utils/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const updateAuthState = () => {
    const token = getAuthToken();
    const user = getCurrentUser();

    if (token && user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
    } else {
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    updateAuthState();
    setLoading(false);
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'user') {
        updateAuthState();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setIsAuthenticated(true);
    setCurrentUser(user);
  };

  const logout = () => {
    logoutService();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const value = {
    isAuthenticated,
    currentUser,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
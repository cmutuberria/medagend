import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authClient } from '../client/auth.client';
import { create } from 'zustand';
import { useAuthStore } from '../stores/auth.store';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export const useAuth = (): AuthContextType => {
  const [loading, setLoading] = useState(true);
  const { user, setUser, token, setToken } = useAuthStore();

  const navigate = useNavigate();
  useEffect(() => {
    // Verificar si hay datos de autenticación al cargar la aplicación

    if (token && user) {
      try {
        setUser(user);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }

    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const token = await authClient.login(email, password);
    setToken(token);
    const userData = await authClient.me();
    setUser(userData);
    setLoading(false);
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    authClient.logout().catch((error) => {
      console.error('Error logging out:', error);
    });
    navigate('/login');
  };

  return {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
  };
};

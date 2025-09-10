import { useNavigate } from 'react-router-dom';
import { authClient } from '../client/auth.client';
import { useAuthStore } from '../stores/auth.store';
import { User, CreateUserInput } from '../models/user.model';

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  signup: (user: CreateUserInput) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const useAuth = (): AuthContextType => {
  const { user, setUser, token, setToken } = useAuthStore();

  const navigate = useNavigate();

  const login = async (email: string, password: string): Promise<void> => {
    console.log('login', email, password);
    const token = await authClient.login(email, password);
    setToken(token);
    const userData = await authClient.me();
    setUser(userData);
  };

  const refresh = async () => {
    const token = await authClient.refresh();
    setToken(token);
  };

  const logout = async () => {
    console.log('logout');
    setUser(null);
    setToken(null);
    await authClient.logout().catch((error) => {
      console.error('Error logging out:', error);
    });
    navigate('/login');
  };

  const signup = async (user: CreateUserInput) => {
    await authClient.signup(user);
    await login(user.email, user.password);
  };

  return {
    user,
    isAuthenticated: !!user,
    token,
    login,
    logout,
    refresh,
    signup,
  };
};

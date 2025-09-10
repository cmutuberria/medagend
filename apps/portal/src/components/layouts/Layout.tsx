import React from 'react';
import { Header } from '../Header';
import { useAuthStore } from '../../stores/auth.store';
import { useAuth } from '../../hooks/useAuth';
// import Logo from '../Logo';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuthStore();
  const { logout } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header user={user || undefined} onLogout={logout} />

      {/* Content */}
      <div className="px-4 py-6 container mx-auto">{children}</div>
    </div>
  );
};

export default Layout;

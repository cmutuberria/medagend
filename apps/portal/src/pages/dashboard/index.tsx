import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../stores/auth.store';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { logout } = useAuth();

  console.log({ user });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Bienvenido, {user?.name}</span>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Panel de Control
          </h2>
          <p className="text-gray-600">
            Has iniciado sesión correctamente. Aquí puedes gestionar tus citas
            médicas.
          </p>

          {/* Placeholder content */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900">Citas Pendientes</h3>
              <p className="text-2xl font-bold text-blue-600">3</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900">
                Citas Completadas
              </h3>
              <p className="text-2xl font-bold text-green-600">12</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900">Próxima Cita</h3>
              <p className="text-sm text-purple-600">15 de Enero, 2024</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

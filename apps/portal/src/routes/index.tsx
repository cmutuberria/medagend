import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from '../pages/login';
import SignUpPage from '../pages/signup';
import DashboardPage from '../pages/dashboard';
import { DoctorDetailPage } from '../pages/doctor-detail';
import ProtectedRoute from '../components/ProtectedRoute';
import PublicRoute from '../components/PublicRoute';
import Layout from '../components/layouts/Layout';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignUpPage />
          </PublicRoute>
        }
      />

      {/* Rutas protegidas */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <DoctorDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Redirección por defecto */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Ruta 404 */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;

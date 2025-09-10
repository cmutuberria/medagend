import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Heart, LogIn } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layouts/AuthLayout';
import { CustomInput } from '../../components/UI/custom-input';
import { useAuth } from '../../hooks/useAuth';
import { Login, LoginSchema } from '../../models/auth.model';

export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Login>({
    resolver: zodResolver(LoginSchema),
  });
  const onSubmit = async (data: Login) => {
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      setServerError('Error al iniciar sesión. Verifica tus credenciales.');
    }
  };

  return (
    <AuthLayout>
      <div className="text-center pb-6 pt-8 px-6">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full flex items-center justify-center mb-4">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl text-gray-800 mb-2">Iniciar Sesión</h1>
        <p className="text-gray-600">Accede a tu cuenta de salud</p>
      </div>

      {/* Error Message */}
      {serverError && (
        <div className="px-6 pb-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {serverError}
          </div>
        </div>
      )}

      {/* Login Form */}
      <div className="px-6 pb-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            <CustomInput
              label="Correo electrónico"
              register={register('email')}
              error={errors.email?.message}
              required
            />

            <CustomInput
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              register={register('password')}
              error={errors.password?.message}
              required
            >
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </CustomInput>
          </div>

          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              className="text-blue-600 hover:text-blue-400 hover:underline transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500  hover:bg-blue-400  text-white py-3 px-4 rounded-md transition-all duration-200 flex items-center justify-center gap-2 mt-6"
          >
            <LogIn className="w-4 h-4" />
            Iniciar sesión
          </button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            ¿No tienes una cuenta?{' '}
            <Link
              to="/signup"
              className="text-blue-500 hover:text-blue-400 hover:underline transition-colors"
            >
              Crear cuenta
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Eye,
  EyeOff,
  Heart,
  Loader2,
  Stethoscope,
  UserCheck,
  User as UserIcon,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layouts/AuthLayout';
import { useAuth } from '../../hooks/useAuth';
import {
  CreateUserInput,
  CreateUserInputSchema,
  UserRoleSchema,
  SpecialtySchema,
} from '../../models/user.model';
import { CustomInput } from '../../components/UI/custom-input';
import { CustomSelect } from '../../components/UI/custom-select';
export const SignUpPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('patient');
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();
  // const location = useLocation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(CreateUserInputSchema),
    defaultValues: {
      role: UserRoleSchema.enum.PATIENT,
    },
  });

  // Sincronizar el tab con el campo role del formulario

  useEffect(() => {
    setValue(
      'role',
      activeTab === 'patient'
        ? UserRoleSchema.enum.PATIENT
        : UserRoleSchema.enum.PROFESSIONAL
    );
    if (activeTab === 'patient') {
      setValue('bio', undefined);
      setValue('licenseNumber', undefined);
      setValue('specialty', undefined);
    }
  }, [activeTab, setValue]);

  const onSubmit = async (data: CreateUserInput) => {
    try {
      // Convertir UserInput a CreateUserInput

      console.log('signup data to send', data);
      await signup(data);
      // const from = location.state?.from?.pathname || '/dashboard';
      // navigate(from, { replace: true });
      navigate('/dashboard');
    } catch (err) {
      setServerError('Error al crear la cuenta. Verifica tus datos.');
    }
  };

  return (
    <AuthLayout>
      {/* Header */}
      <div className="text-center pb-6 pt-8 px-6">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full flex items-center justify-center mb-4">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl text-gray-800 mb-2">Crear Cuenta</h1>
        <p className="text-gray-600">Únete a nuestra plataforma de salud</p>
      </div>

      {/* Error Message */}

      {serverError && (
        <div className="px-6 pb-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {serverError}
          </div>
        </div>
      )}

      <div className="px-6 pb-6">
        {/* Tabs */}
        <div className="mb-6">
          <div className="grid grid-cols-2 bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setActiveTab('patient')}
              className={`flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all ${
                activeTab === 'patient'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              Paciente
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('doctor')}
              className={`flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all ${
                activeTab === 'doctor'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              Doctor
            </button>
          </div>
          {errors.role && (
            <p className="text-red-500 text-sm">{errors.role.message}</p>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Common fields */}
          <div className="space-y-4">
            <CustomInput
              label="Nombre completo"
              placeholder="Ingresa tu nombre completo"
              register={register('name')}
              error={errors.name?.message}
              required
            />

            <CustomInput
              label="Correo electrónico"
              placeholder="tu@email.com"
              register={register('email')}
              error={errors.email?.message}
              required
            />

            <CustomInput
              label="Teléfono"
              placeholder="+1 (555) 000-0000"
              register={register('phone')}
              error={errors.phone?.message}
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

          {/* Doctor specific fields */}
          {activeTab === 'doctor' && (
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="text-lg text-gray-800 mb-4">
                Información Profesional
              </h3>

              <div className="space-y-4">
                <CustomInput
                  label="Número de licencia profesional"
                  register={register('licenseNumber')}
                  error={errors.licenseNumber?.message}
                  required
                />

                <CustomSelect
                  label="Especialidad"
                  register={register('specialty')}
                  error={errors.specialty?.message}
                  required
                  options={Object.values(SpecialtySchema.enum).map(
                    (specialty) => ({
                      value: specialty,
                      label:
                        specialty.charAt(0).toUpperCase() +
                        specialty.slice(1).toLowerCase(),
                    })
                  )}
                />

                <CustomInput
                  type="textarea"
                  label="Biografía profesional"
                  placeholder="Describe tu experiencia, educación y enfoque médico..."
                  register={register('bio')}
                  error={errors.bio?.message}
                  required
                  rows={4}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 hover:from-blue-600 text-white py-3 px-4 rounded-md transition-all duration-200 flex items-center justify-center gap-2 mt-6"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <UserCheck className="w-4 h-4" />
                Crear cuenta
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link
              to="/login"
              className="text-blue-500 hover:text-blue-600 hover:underline transition-colors"
            >
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUpPage;

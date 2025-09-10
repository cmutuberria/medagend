import { z } from 'zod';

export const UserRoleSchema = z.enum(['PATIENT', 'PROFESSIONAL']);

export const SpecialtySchema = z.enum([
  'CARDIOLOGY',
  'DERMATOLOGY',
  'ENDOCRINOLOGY',
  'GASTROENTEROLOGY',
  'GYNECOLOGY',
  'MEDICINE',
  'NEUROLOGY',
  'OPHTHALMOLOGY',
  'PEDIATRICS',
  'PSYCHIATRY',
  'RADIOLOGY',
  'TRAUMATOLOGY',
]);

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email('Email inválido'),
  // password: z.string().min(7, 'La contraseña debe tener al menos 7 caracteres'),
  name: z.string().min(1, 'El nombre es requerido'),
  role: UserRoleSchema,
  phone: z.string().min(1, 'El teléfono es requerido'),
  bio: z.string().optional(),
  licenseNumber: z.string().optional(),
  specialty: SpecialtySchema.optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const CreateUserInputSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  availabilities: true,
}).extend({
  password: z.string().min(7, 'La contraseña debe tener al menos 7 caracteres'),
});

export type User = z.infer<typeof UserSchema>;
export type UserRole = z.infer<typeof UserRoleSchema>;
export type Specialty = z.infer<typeof SpecialtySchema>;
export type CreateUserInput = z.infer<typeof CreateUserInputSchema>;

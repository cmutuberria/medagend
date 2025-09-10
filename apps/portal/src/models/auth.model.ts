import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string(),
});

export type Login = z.infer<typeof LoginSchema>;

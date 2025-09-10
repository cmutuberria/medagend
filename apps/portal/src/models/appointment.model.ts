import { z } from 'zod';

export const AppointmentStatusSchema = z.enum([
  'PENDING',
  'CONFIRMED',
  'CANCELED',
  'COMPLETED',
]);

export const AppointmentSchema = z.object({
  id: z.string(),
  patientId: z.string(),
  professionalId: z.string(),
  date: z.date(),
  time: z.string(),
  durationMin: z.number(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELED', 'COMPLETED']),
  price: z.number(),
  paid: z.boolean(),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateAppointmentInputSchema = AppointmentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Appointment = z.infer<typeof AppointmentSchema>;
export type AppointmentStatus = z.infer<typeof AppointmentStatusSchema>;
export type CreateAppointmentInput = z.infer<
  typeof CreateAppointmentInputSchema
>;

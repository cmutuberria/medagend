import z from 'zod';
import { UserSchema } from './user.model';

export const AvailabilitySchema = z.object({
  id: z.string(),
  professionalId: z.string(),
  professional: UserSchema,
  dayOfWeek: z.number(),
  startTime: z.string(),
  endTime: z.string(),
});

export type Availability = z.infer<typeof AvailabilitySchema>;

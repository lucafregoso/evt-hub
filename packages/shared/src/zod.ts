import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(['ADMIN', 'ORGANIZER', 'SPEAKER', 'REVIEWER', 'ATTENDEE']),
});

export const EventSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  date: z.date(),
  description: z.string(),
});

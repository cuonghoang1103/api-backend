// What a client may send. Unknown keys are refused: the role comes from the token, never from the body.
import { z } from 'zod';

const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'time must be HH:MM between 00:00 and 23:59');

export const BookingInput = z.strictObject({
  lab: z.string().regex(/^[A-Z]{2}-\d{3}$/, 'lab must look like BE-201'),
  date: z.iso.date(),
  start: time,
  end: time,
  seats: z.number().int().min(1).max(200),
});

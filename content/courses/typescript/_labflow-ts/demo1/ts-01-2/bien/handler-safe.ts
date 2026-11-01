import { createBooking } from '../../../src/rules/booking.ts';
import { isBookingInput } from './guard.ts';

export function handleCreate(body: string) {
  const data: unknown = JSON.parse(body);      // unknown: "prove it before you use it"
  if (!isBookingInput(data)) return { error: 'INVALID_BODY' };
  return createBooking(data);                  // here data is a BookingInput
}

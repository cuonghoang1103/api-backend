import { createBooking } from '../../../src/rules/booking.ts';

export function handleCreate(body: string) {
  const data: unknown = JSON.parse(body);
  return createBooking(data);                  // no check yet
}

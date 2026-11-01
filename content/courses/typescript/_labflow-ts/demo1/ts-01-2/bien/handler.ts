import { createBooking, type BookingInput } from '../../../src/rules/booking.ts';

// A request body arrives as TEXT. JSON.parse returns "any", so this line compiles.
export function handleCreate(body: string) {
  const input: BookingInput = JSON.parse(body);
  return createBooking(input);
}

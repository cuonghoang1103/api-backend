import { createBooking, type BookingInput } from '../../../src/rules/booking.ts';

// Same thing with "as": still no check — "as" only tells the compiler what to believe.
export function handleCreate(body: string) {
  const input = JSON.parse(body) as BookingInput;
  return createBooking(input);
}

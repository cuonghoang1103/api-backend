import type { Role } from '../../../src/rules/booking.ts';

// The team changed this signature: it used to be needsApproval(seats, role).
export function needsApproval(input: { seats: number; role: Role }): boolean {
  if (input.role === 'LECTURER' || input.role === 'ADMIN') return false;
  return input.seats > 30;
}

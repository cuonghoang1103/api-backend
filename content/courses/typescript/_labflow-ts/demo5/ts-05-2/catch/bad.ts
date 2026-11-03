import { needsApproval } from '../../../src/rules/booking.ts';

export function label(seats: number): string {
  try {
    return String(needsApproval({ seats, role: 'STUDENT' }));
  } catch (e) {
    return e.message; // e is unknown
  }
}
void label;

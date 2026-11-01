// The same call with a typed body: tsc refuses null for a parameter that is only "optional".
import type { Role } from '../../../src/rules/booking.ts';

function seatsWanted({ seats = 1 }: { seats?: number; role?: Role }): number {
  return seats;
}

seatsWanted({ role: 'LECTURER' });
seatsWanted({ seats: null, role: 'STUDENT' });

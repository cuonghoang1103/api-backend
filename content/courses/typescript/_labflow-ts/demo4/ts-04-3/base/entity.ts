import type { Role } from '../../../src/rules/booking.ts';
import type { LabCode, TimeRange } from '../../../src/rules/schedule.ts';

// What every stored record has — written once.
export interface Entity {
  readonly id: number;
  readonly createdAt: string;
}

export interface User extends Entity {
  email: string;
  name: string;
  role: Role;
}

export interface BookingRecord extends Entity {
  readonly lab: LabCode;
  readonly userId: number;
  readonly range: TimeRange;
  readonly seats: number;
}

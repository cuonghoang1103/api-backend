// LabFlow — the data model: labs, users, stored bookings (Chapter 4, = Lab 4 reference solution).
import type { Role } from './booking.ts';
import type { LabCode, TimeRange } from './schedule.ts';

// Every stored record has an id and a creation time, both set once by the database.
export interface Entity {
  readonly id: number;
  readonly createdAt: string;
}

// A lab room. equipment is absent until someone records it ([] would mean "recorded: nothing").
export interface Lab {
  readonly code: LabCode;
  name: string;
  capacity: number;
  equipment?: readonly string[];
}

export interface User extends Entity {
  email: string;
  name: string;
  role: Role;
  studentCode?: string; // students only
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

// A stored booking is a snapshot: change it with withStatus, which returns a NEW record.
export interface BookingRecord extends Entity {
  readonly lab: LabCode;
  readonly userId: number;
  readonly range: TimeRange;
  readonly seats: number;
  readonly status: BookingStatus;
  readonly note: string | null;
}

// What the admin list shows: the record plus two names looked up elsewhere.
export type BookingView = BookingRecord & { labName: string; userName: string };

// One entry per lab — no more, no less. Add a lab to LABS and tsc points here.
export const LAB_INFO: Record<LabCode, Lab> = {
  'BE-201': { code: 'BE-201', name: 'Backend Lab 1', capacity: 40, equipment: ['projector', 'whiteboard'] },
  'BE-202': { code: 'BE-202', name: 'Backend Lab 2', capacity: 40 },
  'AL-301': { code: 'AL-301', name: 'AI Lab', capacity: 30, equipment: ['GPU server'] },
};

export function labName(code: LabCode): string {
  return LAB_INFO[code].name;
}

export function freeSeats(lab: Lab, booked: number): number {
  return Math.max(0, lab.capacity - booked);
}

// Seats booked per lab (cancelled bookings do not count). Every lab appears, even with 0.
export function seatsByLab(bookings: readonly BookingRecord[]): Record<LabCode, number> {
  const total: Record<LabCode, number> = { 'BE-201': 0, 'BE-202': 0, 'AL-301': 0 };
  for (const b of bookings) {
    if (b.status !== 'CANCELLED') total[b.lab] += b.seats;
  }
  return total;
}

// Users by id: ids arrive at runtime, so the key set is open. A read may miss: User | undefined.
export function indexById(users: readonly User[]): Record<number, User> {
  const byId: Record<number, User> = {};
  for (const u of users) byId[u.id] = u;
  return byId;
}

// A new record with another status; the original is untouched.
export function withStatus(b: BookingRecord, status: BookingStatus): BookingRecord {
  return { ...b, status };
}

export function toView(b: BookingRecord, users: Record<number, User>): BookingView {
  return { ...b, labName: labName(b.lab), userName: users[b.userId]?.name ?? '(deleted user)' };
}

// Attempt B — interfaces, literal unions, a required capacity. No readonly, and the lab table is an open dictionary.
import type { Role } from './booking.ts';
import type { LabCode, TimeRange } from './schedule.ts';

export interface Entity {
  id: number;
  createdAt: string;
}

export interface Lab {
  code: LabCode;
  name: string;
  capacity: number;
  equipment?: string[];
}

export interface User extends Entity {
  email: string;
  name: string;
  role: Role;
  studentCode?: string;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export interface BookingRecord extends Entity {
  lab: LabCode;
  userId: number;
  range: TimeRange;
  seats: number;
  status: BookingStatus;
  note: string | null;
}

export type BookingView = BookingRecord & { labName: string; userName: string };

export const LAB_INFO: { [code: string]: Lab } = {
  'BE-201': { code: 'BE-201', name: 'Backend Lab 1', capacity: 40, equipment: ['projector', 'whiteboard'] },
  'BE-202': { code: 'BE-202', name: 'Backend Lab 2', capacity: 40 },
  'AL-301': { code: 'AL-301', name: 'AI Lab', capacity: 30, equipment: ['GPU server'] },
};

export function labName(code: LabCode): string {
  return LAB_INFO[code]?.name ?? code;
}

export function freeSeats(lab: Lab, booked: number): number {
  return Math.max(0, lab.capacity - booked);
}

export function seatsByLab(bookings: readonly BookingRecord[]): { [lab: string]: number } {
  const total: { [lab: string]: number } = { 'BE-201': 0, 'BE-202': 0, 'AL-301': 0 };
  for (const b of bookings) {
    if (b.status !== 'CANCELLED') total[b.lab] = (total[b.lab] ?? 0) + b.seats;
  }
  return total;
}

export function indexById(users: readonly User[]): { [id: number]: User } {
  const byId: { [id: number]: User } = {};
  for (const u of users) byId[u.id] = u;
  return byId;
}

export function withStatus(b: BookingRecord, status: BookingStatus): BookingRecord {
  return { ...b, status };
}

export function toView(b: BookingRecord, users: { [id: number]: User }): BookingView {
  return { ...b, labName: labName(b.lab), userName: users[b.userId]?.name ?? '(deleted user)' };
}

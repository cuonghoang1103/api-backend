// LabFlow — data model (a teammate's first version). It compiles under strict. Is it right?
import type { Role } from './booking.ts';

export type Lab = {
  code: string;
  name: string;
  capacity?: number; // "made optional: the seed did not compile without it"
  equipment: string[];
};

export type User = {
  id: number;
  createdAt: string;
  email: string;
  name: string;
  role: string;
  studentCode?: string;
};

export type BookingRecord = {
  id: number;
  createdAt: string;
  lab: string;
  userId: number;
  range: number[];
  seats: number;
  status: string;
  note: string | null;
};

export type BookingView = BookingRecord & { labName: string; userName: string };

export type LabTable = { [code: string]: Lab };

export const LAB_INFO: LabTable = {
  'BE-201': { code: 'BE-201', name: 'Backend Lab 1', capacity: 40, equipment: ['projector', 'whiteboard'] },
  'BE-202': { code: 'BE-202', name: 'Backend Lab 2', capacity: 40, equipment: [] },
  'AL-301': { code: 'AL-301', name: 'AI Lab', capacity: 30, equipment: ['GPU server'] },
};

export function labName(code: string): string {
  return LAB_INFO[code]?.name ?? 'unknown lab';
}

export function freeSeats(lab: Lab, booked: number): number {
  return Math.max(0, (lab.capacity ?? 0) - booked);
}

export function seatsByLab(bookings: BookingRecord[]): { [lab: string]: number } {
  const total: { [lab: string]: number } = {};
  for (const b of bookings) {
    if (b.status !== 'CANCELLED') total[b.lab] = (total[b.lab] ?? 0) + b.seats;
  }
  return total;
}

export function indexById(users: User[]): { [id: number]: User } {
  const byId: { [id: number]: User } = {};
  for (const u of users) byId[u.id] = u;
  return byId;
}

export function withStatus(b: BookingRecord, status: string): BookingRecord {
  b.status = status;
  return b;
}

export function toView(b: BookingRecord, users: { [id: number]: User }): BookingView {
  return { ...b, labName: labName(b.lab), userName: users[b.userId]?.name ?? '(deleted user)' };
}

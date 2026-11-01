// Attempt A — "a flexible model": the tests pass, and nothing complains any more.
export interface Lab {
  code: string;
  name: string;
  capacity: number;
  equipment?: string[];
  [extra: string]: any; // room for whatever the seed adds later
}

export interface User {
  id: number;
  createdAt: string;
  email: string;
  name: string;
  role: string;
  studentCode?: string;
}

export interface BookingRecord {
  id: number;
  createdAt: string;
  lab: string;
  userId: number;
  range: number[];
  seats: number;
  status: string;
  note: string | null;
}

export type BookingView = BookingRecord & { labName: string; userName: string };

export const LAB_INFO: any = {
  'BE-201': { code: 'BE-201', name: 'Backend Lab 1', capacity: 40, equipment: ['projector', 'whiteboard'] },
  'BE-202': { code: 'BE-202', name: 'Backend Lab 2', capacity: 40 },
  'AL-301': { code: 'AL-301', name: 'AI Lab', capacity: 30, equipment: ['GPU server'] },
};

export function labName(code: string): string {
  return LAB_INFO[code].name;
}

export function freeSeats(lab: Lab, booked: number): number {
  return Math.max(0, lab.capacity - booked);
}

export function seatsByLab(bookings: BookingRecord[]): any {
  const total: any = { 'BE-201': 0, 'BE-202': 0, 'AL-301': 0 };
  for (const b of bookings) {
    if (b.status !== 'CANCELLED') total[b.lab] += b.seats;
  }
  return total;
}

export function indexById(users: User[]): { [id: number]: User } {
  const byId: { [id: number]: User } = {};
  for (const u of users) byId[u.id] = u;
  return byId;
}

export function withStatus(b: BookingRecord, status: string): BookingRecord {
  return { ...b, status };
}

export function toView(b: BookingRecord, users: { [id: number]: User }): BookingView {
  return { ...b, labName: labName(b.lab), userName: users[b.userId]?.name ?? '(deleted user)' };
}

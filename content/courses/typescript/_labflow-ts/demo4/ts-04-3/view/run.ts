import type { BookingRecord, User } from '../base/entity.ts';

type BookingView = BookingRecord & { labName: string; userName: string };

const binh: User = { id: 2, createdAt: '2026-11-01T08:05:00Z', email: 'binh.tt@fpt.edu.vn', name: 'Tran Thi Binh', role: 'LECTURER' };
const rec: BookingRecord = { id: 11, createdAt: '2026-11-01T09:00:00Z', lab: 'AL-301', userId: 2, range: [600, 720], seats: 25 };

// Spread the record, add the two names: the result has every field of both.
function toView(b: BookingRecord, user: User): BookingView {
  return { ...b, labName: 'AI Lab', userName: user.name };
}
console.log(toView(rec, binh));

import type { BookingRecord } from '../base/entity.ts';

// & — "a BookingRecord AND these two fields".
export type BookingView = BookingRecord & { labName: string; userName: string };

declare const rec: BookingRecord;
const ok: BookingView = { ...rec, labName: 'AI Lab', userName: 'Tran Thi Binh' };
const half: BookingView = { ...rec, labName: 'AI Lab' };
export { ok, half };

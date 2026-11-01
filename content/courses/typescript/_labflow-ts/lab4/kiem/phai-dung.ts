// Lab 4 — CORRECT uses. They must keep compiling with your types (part B).
import { LAB_INFO, labName, freeSeats, seatsByLab, indexById, withStatus, toView } from '../src/model.ts';
import type { Lab, User, BookingRecord, BookingView } from '../src/model.ts';
import { LABS } from '../src/schedule.ts';

const an: User = { id: 1, createdAt: '2026-11-01T08:00:00Z', email: 'an.nv@fpt.edu.vn', name: 'An', role: 'STUDENT', studentCode: 'HE176322' };
const rec: BookingRecord = { id: 10, createdAt: '2026-11-01T09:00:00Z', lab: 'BE-201', userId: 1, range: [480, 600], seats: 30, status: 'PENDING', note: null };

for (const code of LABS) {
  const capacity: number = LAB_INFO[code].capacity;            // every lab is there: no undefined to check
  console.log(labName(code), capacity);
}
const lab: Lab = LAB_INFO['AL-301'];
const tools: number = lab.equipment?.length ?? 0;             // optional: checked before use
const free: number = freeSeats(lab, 12);
const perLab: number = seatsByLab([rec])['BE-202'];          // a number, not number | undefined
const byId = indexById([an]);
const maybe: User | undefined = byId[1];                      // an open key set may miss
const approved: BookingRecord = withStatus(rec, 'CONFIRMED');
const view: BookingView = toView(rec, byId);
const room: Lab = { code: 'BE-202', name: 'Backend Lab 2', capacity: 40, equipment: [] };   // recorded: nothing
console.log(tools, free, perLab, maybe, approved, view.labName, room);

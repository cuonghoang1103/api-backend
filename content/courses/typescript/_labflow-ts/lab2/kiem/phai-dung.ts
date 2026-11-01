// Lab 2 — CORRECT uses. They must keep compiling with your types (part B).
import { LABS, isLab, toRange, findEntry, noteOf, firstStart, sortByStart, labelOf } from '../src/schedule.ts';
import type { LabCode, ScheduleEntry } from '../src/schedule.ts';

// Rows as they come from the database: a NULL note, and no cancelledAt until a booking is cancelled.
const today: readonly ScheduleEntry[] = [
  { id: 1, lab: 'BE-201', range: [600, 720], bookedBy: 'an.nv', note: null },
  { id: 2, lab: 'BE-201', range: toRange('08:00-10:00'), bookedBy: 'binh.tt', note: '', cancelledAt: '2026-11-01T09:15:00Z' },
];

const sorted: ScheduleEntry[] = sortByStart(today);    // a read-only list is accepted, a new list comes back
const start: number = toRange('08:00-10:00')[0];        // position 0 of a range is always there
const firstLab: LabCode = LABS[0];                      // so is position 0 of the fixed list of labs

const found = findEntry(today, 1);
if (found !== undefined) console.log(noteOf(found), labelOf(found));

const first = firstStart(today, 'BE-201');
if (first !== null) console.log(first + 30);

const fromQuery: string = 'AL-301';
if (isLab(fromQuery)) {
  const lab: LabCode = fromQuery;                       // after the check, the text IS a LabCode
  console.log(lab, sorted.length, start, firstLab);
}

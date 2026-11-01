import { LABS } from '../../../src/rules/schedule.ts';
import type { LabCode } from '../../../src/rules/schedule.ts';

type Row = { lab: LabCode; seats: number };
const today: Row[] = [{ lab: 'BE-201', seats: 30 }, { lab: 'AL-301', seats: 25 }, { lab: 'BE-201', seats: 6 }];

// Version 1: an open dictionary that starts empty.
export function seatsByLabOpen(rows: readonly Row[]): { [lab: string]: number } {
  const total: { [lab: string]: number } = {};
  for (const r of rows) total[r.lab] = (total[r.lab] ?? 0) + r.seats;
  return total;
}

// Version 2: the type says "every lab".
export function seatsByLab(rows: readonly Row[]): Record<LabCode, number> {
  const total: Record<LabCode, number> = { 'BE-201': 0, 'BE-202': 0, 'AL-301': 0 };
  for (const r of rows) total[r.lab] += r.seats;
  return total;
}

console.log('open  :', seatsByLabOpen(today));
console.log('record:', seatsByLab(today));
for (const lab of LABS) console.log(lab, 'booked', seatsByLabOpen(today)[lab] ?? 'n/a', '|', seatsByLab(today)[lab]);

import { formatTime } from '../../../src/rules/time.ts';
import type { ScheduleEntry, TimeRange } from '../../../src/rules/schedule.ts';
import { totalMinutes } from '../rest/total.ts';

function rangeLabel(start: number, end: number): string {
  return formatTime(start) + '–' + formatTime(end);
}

const today: ScheduleEntry[] = [
  { id: 1, lab: 'BE-201', range: [480, 600], bookedBy: 'an.nv', note: null },
  { id: 2, lab: 'BE-201', range: [600, 720], bookedBy: 'binh.tt', note: null },
];

const range: TimeRange = [480, 600];
const loose = [480, 600];                       // inferred number[] — any length

console.log(rangeLabel(...range));              // a tuple spreads into exactly two parameters
console.log(totalMinutes(...today.map((e) => e.range)));   // an array spreads into a REST parameter
rangeLabel(...loose);

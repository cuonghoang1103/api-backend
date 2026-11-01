// Lab 2 — attempt A ("yếu" = weak): the runtime bugs the tests found are fixed (?? and a copy before sort),
// but every compiler error was made to go away with "!" and "as". The types still say what they said under strict: false.
import { parseTime, formatTime } from './time.ts';

export const LABS = ['BE-201', 'BE-202', 'AL-301'];
export type LabCode = string;
export type TimeRange = number[];   // [start, end] in minutes since 00:00

export type ScheduleEntry = {
  id: number;
  lab: LabCode;
  range: TimeRange;
  bookedBy: string;
  note: string;
  cancelledAt: string;
};

export function isLab(text: string): boolean {
  return LABS.includes(text);
}

export function toRange(text: string): TimeRange {
  const [from, to, extra] = text.split('-');
  if (extra !== undefined) throw new TypeError('Invalid range "' + text + '", expected HH:MM-HH:MM');
  return [parseTime(from!), parseTime(to!)];
}

export function findEntry(schedule: ScheduleEntry[], id: number): ScheduleEntry {
  return schedule.find((e) => e.id === id) as ScheduleEntry;
}

export function noteOf(entry: ScheduleEntry): string {
  return entry.note ?? '(no note)';
}

export function firstStart(schedule: ScheduleEntry[], lab: LabCode): number {
  let best = null as unknown as number;
  for (const e of schedule) {
    if (e.lab !== lab || e.cancelledAt) continue;
    if (best === null || e.range[0]! < best) best = e.range[0]!;
  }
  return best;
}

export function sortByStart(schedule: ScheduleEntry[]): ScheduleEntry[] {
  return [...schedule].sort((a, b) => a.range[0]! - b.range[0]!);
}

export function labelOf(entry: ScheduleEntry): string {
  const [start, end] = entry.range;
  const state = entry.cancelledAt ? ' (cancelled ' + entry.cancelledAt.slice(0, 10) + ')' : '';
  return entry.lab + ' ' + formatTime(start!) + '–' + formatTime(end!) + ' ' + entry.bookedBy + state;
}

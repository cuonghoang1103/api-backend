// Lab 2 — attempt B ("vừa" = so-so): null and undefined are honest now (no "!", no "as"),
// but a range is still number[] and the labs are still a string[] — the shapes are not written down.
import { parseTime, formatTime } from './time.ts';

export const LABS = ['BE-201', 'BE-202', 'AL-301'];
export type LabCode = string;
export type TimeRange = number[];   // [start, end] in minutes since 00:00

export type ScheduleEntry = {
  id: number;
  lab: LabCode;
  range: TimeRange;
  bookedBy: string;
  note: string | null;
  cancelledAt?: string;
};

export function isLab(text: string): boolean {
  return LABS.includes(text);
}

export function toRange(text: string): TimeRange {
  const [from, to, extra] = text.split('-');
  if (from === undefined || to === undefined || extra !== undefined) {
    throw new TypeError('Invalid range "' + text + '", expected HH:MM-HH:MM');
  }
  return [parseTime(from), parseTime(to)];
}

export function findEntry(schedule: readonly ScheduleEntry[], id: number): ScheduleEntry | undefined {
  return schedule.find((e) => e.id === id);
}

export function noteOf(entry: ScheduleEntry): string {
  return entry.note ?? '(no note)';
}

export function firstStart(schedule: readonly ScheduleEntry[], lab: LabCode): number | null {
  let best: number | null = null;
  for (const e of schedule) {
    const start = e.range[0];
    if (e.lab !== lab || e.cancelledAt !== undefined || start === undefined) continue;
    if (best === null || start < best) best = start;
  }
  return best;
}

export function sortByStart(schedule: readonly ScheduleEntry[]): ScheduleEntry[] {
  return schedule.toSorted((a, b) => (a.range[0] ?? 0) - (b.range[0] ?? 0));
}

export function labelOf(entry: ScheduleEntry): string {
  const [start = 0, end = 0] = entry.range;
  const state = entry.cancelledAt === undefined ? '' : ' (cancelled ' + entry.cancelledAt.slice(0, 10) + ')';
  return entry.lab + ' ' + formatTime(start) + '–' + formatTime(end) + ' ' + entry.bookedBy + state;
}

// LabFlow — one lab's schedule for a day (Chapter 2, = Lab 2 reference solution).
import { parseTime, formatTime } from './time.ts';

// The one list of labs. `as const` keeps the exact strings, so the type below is derived from it, never copied.
export const LABS = ['BE-201', 'BE-202', 'AL-301'] as const;
export type LabCode = (typeof LABS)[number];

// [start, end] in minutes since 00:00 — exactly two numbers, never changed in place.
export type TimeRange = readonly [start: number, end: number];

export type ScheduleEntry = {
  id: number;
  lab: LabCode;
  range: TimeRange;
  bookedBy: string;
  note: string | null;      // NULL in the database: the booker wrote no note ('' is a real, empty note)
  cancelledAt?: string;     // absent until the booking is cancelled
};

// A text from outside (a query string, a form) is checked at runtime before it is trusted to be a LabCode.
export function isLab(text: string): text is LabCode {
  return LABS.some((lab) => lab === text);
}

// "08:00-10:00" -> [480, 600]
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

// Earliest start of a lab today, ignoring cancelled bookings; null when the lab is free all day.
export function firstStart(schedule: readonly ScheduleEntry[], lab: LabCode): number | null {
  let best: number | null = null;
  for (const e of schedule) {
    if (e.lab !== lab || e.cancelledAt !== undefined) continue;
    if (best === null || e.range[0] < best) best = e.range[0];
  }
  return best;
}

// A sorted COPY: the caller's list keeps its order.
export function sortByStart(schedule: readonly ScheduleEntry[]): ScheduleEntry[] {
  return schedule.toSorted((a, b) => a.range[0] - b.range[0]);
}

// "BE-201 08:00–10:00 an.nv (cancelled 2026-11-02)"
export function labelOf(entry: ScheduleEntry): string {
  const [start, end] = entry.range;
  const state = entry.cancelledAt === undefined ? '' : ' (cancelled ' + entry.cancelledAt.slice(0, 10) + ')';
  return entry.lab + ' ' + formatTime(start) + '–' + formatTime(end) + ' ' + entry.bookedBy + state;
}

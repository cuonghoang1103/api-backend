// LabFlow — one lab's schedule for a day.
// A teammate wrote this file while the project still had "strict": false (lab2/tsconfig.loose.json).
// Lab 2: make it honest under the course's strict tsconfig.
import { parseTime, formatTime } from './time.ts';

export const LABS = ['BE-201', 'BE-202', 'AL-301'];
export type LabCode = string;
export type TimeRange = number[];   // [start, end] in minutes since 00:00

export type ScheduleEntry = {
  id: number;
  lab: LabCode;
  range: TimeRange;
  bookedBy: string;
  note: string;          // the database column is NULL when the booker wrote no note
  cancelledAt: string;   // only cancelled bookings have it
};

export function isLab(text: string): boolean {
  return LABS.includes(text);
}

// "08:00-10:00" -> [480, 600]
export function toRange(text: string): TimeRange {
  const [from, to] = text.split('-');
  return [parseTime(from), parseTime(to)];
}

export function findEntry(schedule: ScheduleEntry[], id: number): ScheduleEntry {
  return schedule.find((e) => e.id === id);
}

export function noteOf(entry: ScheduleEntry): string {
  return entry.note || '(no note)';
}

// Earliest start of a lab today, ignoring cancelled bookings.
export function firstStart(schedule: ScheduleEntry[], lab: LabCode): number {
  let best: number = null;
  for (const e of schedule) {
    if (e.lab !== lab || e.cancelledAt) continue;
    if (best === null || e.range[0] < best) best = e.range[0];
  }
  return best;
}

export function sortByStart(schedule: ScheduleEntry[]): ScheduleEntry[] {
  return schedule.sort((a, b) => a.range[0] - b.range[0]);
}

// "BE-201 08:00–10:00 an.nv (cancelled 2026-11-02)"
export function labelOf(entry: ScheduleEntry): string {
  const [start, end] = entry.range;
  const state = entry.cancelledAt ? ' (cancelled ' + entry.cancelledAt.slice(0, 10) + ')' : '';
  return entry.lab + ' ' + formatTime(start) + '–' + formatTime(end) + ' ' + entry.bookedBy + state;
}

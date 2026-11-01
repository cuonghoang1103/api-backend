import type { LabCode, TimeRange } from '../../../../src/rules/schedule.ts';

export interface Booking {
  readonly id: number;
  lab: LabCode;
  range: TimeRange;
  seats: number;
}

export function label(b: Booking): string {
  return b.lab + ' · ' + b.seats + ' seats';
}

// Booking as the calendar export sees it (added later by another teammate).
export interface Booking {
  title: string;
  allDay: boolean;
}

const b1: Booking = { id: 1, lab: 'BE-201', range: [480, 600], seats: 30 };
console.log(label(b1));

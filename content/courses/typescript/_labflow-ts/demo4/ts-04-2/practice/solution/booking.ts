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

// The calendar's view of a booking is a DIFFERENT shape, so it gets its own name.
export interface CalendarEvent {
  title: string;
  allDay: boolean;
  range: TimeRange;
}

export function toEvent(b: Booking): CalendarEvent {
  return { title: label(b), allDay: false, range: b.range };
}

const b1: Booking = { id: 1, lab: 'BE-201', range: [480, 600], seats: 30 };
console.log(label(b1));
console.log(toEvent(b1));

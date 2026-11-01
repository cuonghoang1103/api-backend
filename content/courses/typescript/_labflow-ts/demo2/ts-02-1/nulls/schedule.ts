// One day of LabFlow's schedule — written by a teammate with strictNullChecks OFF.
export type ScheduleEntry = {
  id: number;
  lab: string;
  start: string;
  end: string;
  bookedBy: string;
  note: string | null;      // NULL in the database: "no note"
  cancelledAt?: string;     // absent until the booking is cancelled
};

export const TODAY: ScheduleEntry[] = [
  { id: 1, lab: 'BE-201', start: '08:00', end: '10:00', bookedBy: 'an.nv', note: 'Bring an HDMI cable' },
  { id: 2, lab: 'BE-201', start: '13:00', end: '15:00', bookedBy: 'binh.tt', note: null },
  { id: 3, lab: 'AL-301', start: '09:00', end: '11:00', bookedBy: 'chi.lm', note: null, cancelledAt: '2026-11-01T07:15:00Z' },
];

export function findEntry(schedule: ScheduleEntry[], id: number): ScheduleEntry | undefined {
  return schedule.find((e) => e.id === id);
}

export function noteBanner(e: ScheduleEntry): string {
  return e.note.toUpperCase();
}

export function cancelledOn(e: ScheduleEntry): string {
  return e.cancelledAt.slice(0, 10);
}

export function bookerOf(schedule: ScheduleEntry[], id: number): string {
  return findEntry(schedule, id).bookedBy;
}

export function pickNote(e: ScheduleEntry): string {
  return e.note;
}

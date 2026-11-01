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

// Fix 1 — check first. After the if, tsc knows note is a string.
export function noteBanner(e: ScheduleEntry): string {
  if (e.note === null) return '';
  return e.note.toUpperCase();
}

// Fix 2 — optional chaining: stop and give undefined if the left side is missing. Say so in the return type.
export function cancelledOn(e: ScheduleEntry): string | undefined {
  return e.cancelledAt?.slice(0, 10);
}

// Fix 3 — ?. plus ?? : a default only when the value is null or undefined.
export function bookerOf(schedule: ScheduleEntry[], id: number): string {
  return findEntry(schedule, id)?.bookedBy ?? '(unknown)';
}

export function pickNote(e: ScheduleEntry): string {
  return e.note ?? '(no note)';
}

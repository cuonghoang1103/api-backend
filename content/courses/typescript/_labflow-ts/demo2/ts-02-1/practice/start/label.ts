// Practice 2.1 — make this compile under strict mode. No "!", no "as", no "any".
type ScheduleEntry = {
  id: number;
  lab: string;
  start: string;
  end: string;
  bookedBy: string;
  note: string | null;
  cancelledAt?: string;
};

export function labelOf(e: ScheduleEntry): string {
  const note = e.note.trim();
  const cancelled = ' · cancelled ' + e.cancelledAt.slice(0, 10);
  return e.lab + ' ' + e.start + '-' + e.end + ' · ' + note + cancelled;
}

console.log(labelOf({ id: 1, lab: 'BE-201', start: '08:00', end: '10:00', bookedBy: 'an.nv', note: ' Bring an HDMI cable ' }));
console.log(labelOf({ id: 3, lab: 'AL-301', start: '09:00', end: '11:00', bookedBy: 'chi.lm', note: null, cancelledAt: '2026-11-01T07:15:00Z' }));

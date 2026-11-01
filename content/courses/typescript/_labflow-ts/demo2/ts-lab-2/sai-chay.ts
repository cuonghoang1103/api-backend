// The eight wrong uses of Lab 2, RUN by Node against the teammate's starter (lab2/src/schedule.ts).
// Node strips the types and runs the JavaScript — nothing is checked. What does each one do?
import { LABS, findEntry, firstStart, toRange } from '../../lab2/src/schedule.ts';

const today = [
  { id: 1, lab: 'BE-201', range: [600, 720], bookedBy: 'an.nv', note: null },
  { id: 3, lab: 'BE-202', range: [540, 660], bookedBy: 'chi.lm', note: 'Bring HDMI adapters' },
];
const entry = today[0];

function show(label: string, run: () => unknown): void {
  try {
    console.log(label.padEnd(36), '→', JSON.stringify(run()));
  } catch (e) {
    console.log(label.padEnd(36), '→ throws', String(e));
  }
}

show('S1 findEntry(today, 7).bookedBy', () => findEntry(today, 7).bookedBy);
show('S2 entry.note.toUpperCase()', () => entry.note.toUpperCase());
show('S3 entry.cancelledAt.slice(0, 10)', () => entry.cancelledAt.slice(0, 10));
show("S4 firstStart(today, 'AL-301') + 30", () => firstStart(today, 'AL-301') + 30);
show('S5 a range of three numbers', () => toRange('08:00-10:00-12:00'));
show('S6 entry.range[0] = 0', () => { entry.range[0] = 0; return entry.range; });
show("S7 lab 'BE-999'", () => ({ lab: 'BE-999' }));
show("S8 LABS.push('BE-999')", () => { LABS.push('BE-999'); return LABS; });

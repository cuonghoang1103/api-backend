// Call each function on real data and print what happens.
import { TODAY, noteBanner, cancelledOn, bookerOf, pickNote } from './schedule.ts';

const [withNote, noNote, cancelled] = TODAY;
const cases: [string, () => string][] = [
  ['noteBanner(entry 1)', () => noteBanner(withNote)],
  ['cancelledOn(entry 3)', () => cancelledOn(cancelled)],
  ['noteBanner(entry 2)', () => noteBanner(noNote)],
  ['cancelledOn(entry 1)', () => cancelledOn(withNote)],
  ['bookerOf(TODAY, 9)', () => bookerOf(TODAY, 9)],
  ['pickNote(entry 2)', () => pickNote(noNote)],
];
for (const [label, run] of cases) {
  try {
    console.log(label.padEnd(21), '→', run());
  } catch (error) {
    console.log(label.padEnd(21), '→ throws', String(error));
  }
}

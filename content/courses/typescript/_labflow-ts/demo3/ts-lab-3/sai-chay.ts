// The eight wrong uses of Lab 3, RUN by Node against the teammate's starter (lab3/src/validate.ts).
// Node strips the types and runs the JavaScript — nothing is checked. What does each one do?
import { toMinutes, validate, maxSeats, totalMinutes, createValidator, RULES } from '../../lab3/src/validate.ts';

const input = { lab: 'BE-201', seats: 45, role: 'STUDENT', start: '08:00', end: '10:00' };

function show(label: string, run: () => unknown): void {
  try {
    console.log(label.padEnd(40), '→', JSON.stringify(run()));
  } catch (e) {
    console.log(label.padEnd(40), '→ throws', String(e));
  }
}

show('S1 a rule that takes (seats: number)', () => validate(input, [(seats: number) => (seats > 40 ? 'too many' : null)]));
show("S2 a rule that returns 'TOO_LONG'", () => validate(input, [() => 'TOO_LONG']));
show("S3 toMinutes(['08:00']) + 30", () => toMinutes(['08:00']) + 30);
show('S4 toMinutes(480)', () => toMinutes(480));
show("S5 maxSeats('30') on 45 seats", () => maxSeats('30')(input));
show('S6 totalMinutes([480, 600], 720)', () => totalMinutes([480, 600], 720));
show('S7 validate(input)', () => validate(input));
show('S8 const run = v.run; run(input)', () => { const run = createValidator(RULES).run; return run(input); });

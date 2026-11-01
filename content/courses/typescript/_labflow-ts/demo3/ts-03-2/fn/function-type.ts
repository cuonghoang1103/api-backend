// The type Function says "something callable" — and nothing about what goes in or comes out.
import { endAfterStart } from '../rules/rules.ts';

const loose: Function[] = [endAfterStart, (seats: number) => seats * 2];

const input = { lab: 'BE-201', seats: 31, role: 'STUDENT', start: '10:00', end: '08:00' } as const;
for (const rule of loose) {
  const problem = rule(input);           // problem: any
  console.log(problem?.cod);             // typo in "code" — not reported
}

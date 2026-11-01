// The same list, typed with the Rule function type.
import { endAfterStart } from '../rules/rules.ts';
import type { Rule } from '../rules/rules.ts';

const typed: Rule[] = [endAfterStart, (seats: number) => seats * 2];

const input = { lab: 'BE-201', seats: 31, role: 'STUDENT', start: '10:00', end: '08:00' } as const;
for (const rule of typed) {
  const problem = rule(input);           // problem: Problem | null
  console.log(problem?.cod);
}

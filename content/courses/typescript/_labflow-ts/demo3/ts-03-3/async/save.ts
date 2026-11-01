// Saving each problem to the database is async. The callback slot of validate() says "=> void"…
import { validate } from '../void/validate.ts';
import type { Problem, Rule } from '../void/validate.ts';

const tooMany: Rule = (b) => (b.seats > 40 ? { code: 'TOO_MANY_SEATS', message: 'At most 40 seats' } : null);
const input = { lab: 'BE-201', seats: 45, role: 'STUDENT', start: '08:00', end: '10:00' } as const;

async function saveProblem(p: Problem): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 10));
  throw new Error('database is down, could not save ' + p.code);
}

const problems = validate(input, [tooMany], async (p) => {   // …and still accepts an async function
  await saveProblem(p);
});
console.log('validated:', problems.length, 'problem(s) — response sent');

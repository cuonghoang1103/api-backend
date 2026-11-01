// The fix: do the async work where someone awaits it — a for…of loop with await, inside try/catch.
import { validate } from '../void/validate.ts';
import type { Problem, Rule } from '../void/validate.ts';

const tooMany: Rule = (b) => (b.seats > 40 ? { code: 'TOO_MANY_SEATS', message: 'At most 40 seats' } : null);
const input = { lab: 'BE-201', seats: 45, role: 'STUDENT', start: '08:00', end: '10:00' } as const;

async function saveProblem(p: Problem): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 10));
  throw new Error('database is down, could not save ' + p.code);
}

const problems = validate(input, [tooMany]);
try {
  for (const p of problems) await saveProblem(p);        // awaited: a failure lands in catch
  console.log('validated and saved');
} catch (e) {
  console.log('could not save:', e instanceof Error ? e.message : String(e), '— answer 503, keep running');
}

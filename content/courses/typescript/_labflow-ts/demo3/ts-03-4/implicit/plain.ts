// The same loop as a plain function. Who is "this" here? It depends on the caller — tsc cannot know.
import type { BookingInput } from '../../../src/rules/booking.ts';
import type { Problem, Rule } from '../lost/validator.ts';

export function runRules(input: BookingInput): Problem[] {
  const found: Problem[] = [];
  for (const rule of this.rules) {
    const p: Problem | null = rule(input);
    if (p !== null) found.push(p);
  }
  return found;
}

export const checks: { rules: Rule[]; run: typeof runRules } = { rules: [], run: runRules };

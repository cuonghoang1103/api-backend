// A small validate() for this lesson: rules in, problems out, and an optional callback for each problem.
import type { BookingInput } from '../../../src/rules/booking.ts';

export type Problem = { code: string; message: string };
export type Rule = (input: BookingInput) => Problem | null;

export function validate(input: BookingInput, rules: readonly Rule[], onProblem?: (p: Problem) => void): Problem[] {
  const problems: Problem[] = [];
  for (const rule of rules) {
    const p = rule(input);
    if (p === null) continue;
    problems.push(p);
    onProblem?.(p);            // the result of the callback is ignored — that is what void says
  }
  return problems;
}

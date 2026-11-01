// LabFlow's booking checks as VALUES: each rule is a function, and the list of rules is just an array.
import { parseTime } from '../../../src/rules/time.ts';
import type { BookingInput } from '../../../src/rules/booking.ts';

export type ProblemCode = 'OFF_GRID' | 'END_BEFORE_START' | 'OUTSIDE_HOURS' | 'TOO_LONG' | 'TOO_MANY_SEATS';
export type Problem = { code: ProblemCode; message: string };

// A function TYPE: "takes one booking request, returns a Problem or null".
export type Rule = (input: BookingInput) => Problem | null;

export const endAfterStart: Rule = (input) =>
  parseTime(input.end) <= parseTime(input.start)
    ? { code: 'END_BEFORE_START', message: 'The end must be after the start' }
    : null;

export const notTooLong: Rule = (input) =>
  parseTime(input.end) - parseTime(input.start) > 240
    ? { code: 'TOO_LONG', message: 'At most 4 hours' }
    : null;

// A function that RETURNS a rule. The returned arrow remembers `limit` (a closure).
export function maxSeats(limit: number): Rule {
  return (input) =>
    input.seats > limit ? { code: 'TOO_MANY_SEATS', message: 'At most ' + limit + ' seats' } : null;
}

export function validate(input: BookingInput, rules: readonly Rule[]): Problem[] {
  const problems: Problem[] = [];
  for (const rule of rules) {
    const problem = rule(input);
    if (problem !== null) problems.push(problem);
  }
  return problems;
}

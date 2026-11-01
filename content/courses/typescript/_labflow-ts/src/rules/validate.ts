// LabFlow — check a booking request with a LIST OF RULES (Chapter 3, = Lab 3 reference solution).
import { parseTime } from './time.ts';
import { OPEN, CLOSE, STEP, MAX_MINUTES } from './booking.ts';
import type { BookingInput } from './booking.ts';
import type { TimeRange } from './schedule.ts';

export type ProblemCode = 'OFF_GRID' | 'END_BEFORE_START' | 'OUTSIDE_HOURS' | 'TOO_LONG' | 'TOO_MANY_SEATS';
export type Problem = { code: ProblemCode; message: string };

// A rule looks at one request and returns a problem, or null when the request is fine.
export type Rule = (input: BookingInput) => Problem | null;

// Overloads: one time in, one number out — a list in, a list out.
export function toMinutes(text: string): number;
export function toMinutes(texts: readonly string[]): number[];
export function toMinutes(value: string | readonly string[]): number | number[] {
  return typeof value === 'string' ? parseTime(value) : value.map((t) => parseTime(t));
}

export const onGrid: Rule = ({ start, end }) =>
  toMinutes(start) % STEP !== 0 || toMinutes(end) % STEP !== 0
    ? { code: 'OFF_GRID', message: 'Start and end must be on the 30-minute grid' }
    : null;

export const endAfterStart: Rule = ({ start, end }) =>
  toMinutes(end) <= toMinutes(start) ? { code: 'END_BEFORE_START', message: 'End must be after start' } : null;

export const withinHours: Rule = ({ start, end }) =>
  toMinutes(start) < OPEN || toMinutes(end) > CLOSE
    ? { code: 'OUTSIDE_HOURS', message: 'Labs are open 07:00–21:00' }
    : null;

export const notTooLong: Rule = ({ start, end }) =>
  toMinutes(end) - toMinutes(start) > MAX_MINUTES ? { code: 'TOO_LONG', message: 'At most 4 hours' } : null;

// A function that RETURNS a rule: the limit is remembered by the closure.
export function maxSeats(limit: number): Rule {
  return ({ seats }) => (seats > limit ? { code: 'TOO_MANY_SEATS', message: 'At most ' + limit + ' seats' } : null);
}

export const RULES: readonly Rule[] = [onGrid, endAfterStart, withinHours, notTooLong, maxSeats(40)];

// Runs EVERY rule and collects every problem. onProblem (optional) hears about each one; its result is ignored.
export function validate(input: BookingInput, rules: readonly Rule[], onProblem?: (problem: Problem) => void): Problem[] {
  const problems: Problem[] = [];
  for (const rule of rules) {
    const problem = rule(input);
    if (problem !== null) {
      problems.push(problem);
      onProblem?.(problem);
    }
  }
  return problems;
}

// Any number of ranges, each [start, end]: total booked minutes.
export function totalMinutes(...ranges: TimeRange[]): number {
  let total = 0;
  for (const [start, end] of ranges) total += end - start;
  return total;
}

// A validator remembers its rules; run must be called ON the validator (this).
export type Validator = { rules: readonly Rule[]; run(this: Validator, input: BookingInput): Problem[] };

export function createValidator(rules: readonly Rule[]): Validator {
  return {
    rules,
    run(input) {
      return validate(input, this.rules);
    },
  };
}

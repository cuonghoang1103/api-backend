// LabFlow — check a booking request with a list of rules.
// Lab 3 — attempt B ("vừa" = so-so): honest function types for the rules, but toMinutes still returns a union
// and run() can still be torn off its validator.
import { parseTime } from './time.ts';
import { OPEN, CLOSE, STEP, MAX_MINUTES } from './booking.ts';
import type { BookingInput } from './booking.ts';
import type { TimeRange } from './schedule.ts';

export type Problem = { code: string; message: string };
export type Rule = (input: BookingInput) => Problem | null;

// One "HH:MM" -> minutes, or a list of them -> a list of minutes.
export function toMinutes(value: string | string[]): number | number[] {
  return typeof value === 'string' ? parseTime(value) : value.map((t) => parseTime(t));
}

export const onGrid: Rule = ({ start, end }: BookingInput) =>
  parseTime(start) % STEP !== 0 || parseTime(end) % STEP !== 0
    ? { code: 'OFF_GRID', message: 'Start and end must be on the 30-minute grid' }
    : null;

export const endAfterStart: Rule = ({ start, end }: BookingInput) =>
  parseTime(end) <= parseTime(start) ? { code: 'END_BEFORE_START', message: 'End must be after start' } : null;

export const withinHours: Rule = ({ start, end }: BookingInput) =>
  parseTime(start) < OPEN || parseTime(end) > CLOSE
    ? { code: 'OUTSIDE_HOURS', message: 'Labs are open 07:00–21:00' }
    : null;

export const notTooLong: Rule = ({ start, end }: BookingInput) =>
  parseTime(end) - parseTime(start) > MAX_MINUTES ? { code: 'TOO_LONG', message: 'At most 4 hours' } : null;

export function maxSeats(limit: number): Rule {
  return ({ seats }) => (seats > limit ? { code: 'TOO_MANY_SEATS', message: 'At most ' + limit + ' seats' } : null);
}

export const RULES: Rule[] = [onGrid, endAfterStart, withinHours, notTooLong, maxSeats(40)];

export function validate(input: BookingInput, rules: Rule[], onProblem?: (problem: Problem) => void): Problem[] {
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

export function totalMinutes(...ranges: TimeRange[]): number {
  let total = 0;
  for (const [start, end] of ranges) total += end - start;
  return total;
}

export function createValidator(rules: Rule[]) {
  return {
    rules,
    run(input: BookingInput) {
      return validate(input, this.rules);
    },
  };
}

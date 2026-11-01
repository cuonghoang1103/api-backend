// Practice — solution: type the factory's parameter and its RESULT; the inner arrow then needs no annotation.
import { parseTime } from '../../../../src/rules/time.ts';
import type { Rule } from '../../rules/rules.ts';

export function notBefore(time: string): Rule {
  return (input) =>
    parseTime(input.start) < parseTime(time) ? { code: 'OUTSIDE_HOURS', message: 'Not before ' + time } : null;
}

import { usageRate } from '../../../src/rules/booking.ts';

// Practice solution: prove that unknown data is a list of { minutes: number }.
export function isMinutesList(x: unknown): x is { minutes: number }[] {
  return (
    Array.isArray(x) &&
    x.every((b: unknown) =>
      typeof b === 'object' && b !== null &&
      'minutes' in b && typeof b.minutes === 'number' && b.minutes > 0)
  );
}

export function rateFromBody(body: string): number | 'INVALID_BODY' {
  const data: unknown = JSON.parse(body);
  if (!isMinutesList(data)) return 'INVALID_BODY';
  return usageRate(data);
}

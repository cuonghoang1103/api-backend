// Load a lab's booking history from JSON text — the "unknown" version.
import { usageRate } from '../../../src/rules/booking.ts';

export function loadHistory(text: string): { minutes: number }[] {
  const data: unknown = JSON.parse(text);
  if (!Array.isArray(data)) throw new TypeError('history must be a list');
  return data.map((row: unknown, i: number) => {
    if (typeof row === 'object' && row !== null && 'minutes' in row && typeof row.minutes === 'number') {
      return { minutes: row.minutes };
    }
    throw new TypeError('row ' + i + ': minutes must be a number');
  });
}

for (const text of ['[{"minutes":420},{"minutes":210}]', '[{"minutes":420},{"minute":210}]', '{"minutes":420}']) {
  try {
    console.log('usage:', usageRate(loadHistory(text)));
  } catch (e) {
    console.log('rejected:', e instanceof Error ? e.message : e);
  }
}

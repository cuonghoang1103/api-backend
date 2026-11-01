// Load a lab's booking history from JSON text — the "any" version.
import { usageRate } from '../../../src/rules/booking.ts';

export function loadHistory(text: string) {
  return JSON.parse(text);               // any leaks out to every caller
}

const history = loadHistory('[{"minutes":420},{"minute":210}]');
console.log('usage:', usageRate(history));

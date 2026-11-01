import { usageRate } from '../../../src/rules/booking.ts';

// Before the practice: JSON.parse returns any, so this compiles.
const body = '[{"minutes":120},{"minutes":"1h"}]';
console.log(usageRate(JSON.parse(body)));

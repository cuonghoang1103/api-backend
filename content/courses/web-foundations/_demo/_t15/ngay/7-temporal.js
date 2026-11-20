// Temporal: the new date-time API. Check support before using it without a polyfill.
console.log('typeof Temporal → ' + typeof Temporal);
const day = Temporal.PlainDate.from('2026-11-20');
console.log('PlainDate ' + day.toString() + ': month = ' + day.month + ' (counts from 1)');
console.log('31 Jan 2027 + 1 month → ' + Temporal.PlainDate.from('2027-01-31').add({ months: 1 }).toString());
const ny = Temporal.ZonedDateTime.from('2026-10-31T12:00[America/New_York]');
console.log('+ { days: 1 }   → ' + ny.add({ days: 1 }).toString());
console.log('+ { hours: 24 } → ' + ny.add({ hours: 24 }).toString());

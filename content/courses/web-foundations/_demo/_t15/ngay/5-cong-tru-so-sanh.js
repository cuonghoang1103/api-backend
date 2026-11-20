// Adding "one day" is not always adding 24 hours.
const start = new Date(2026, 9, 31, 12, 0);                  // 31 Oct 2026, 12:00 local
const plus24h = new Date(start.getTime() + 24 * 60 * 60 * 1000);
const nextDay = new Date(start);
nextDay.setDate(nextDay.getDate() + 1);                       // calendar arithmetic
const hm = (d) => d.toDateString() + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
console.log('start          → ' + hm(start));
console.log('+ 86 400 000 ms → ' + hm(plus24h));
console.log('setDate(+1)    → ' + hm(nextDay));

// Comparing: two Date objects are two objects.
const a = new Date('2026-11-20T00:00:00Z');
const b = new Date('2026-11-20T00:00:00Z');
console.log('a === b → ' + (a === b) + ';  a.getTime() === b.getTime() → ' + (a.getTime() === b.getTime()));
console.log('a < b + 1 ms → ' + (a < new Date(b.getTime() + 1)));

// Sorting: subtract (Date turns into its number)
const deadlines = [new Date(2026, 11, 1), new Date(2026, 10, 25), new Date(2027, 0, 5)];
console.log('sorted → ' + deadlines.sort((x, y) => x - y).map((d) => d.toDateString()).join(' | '));

// Whole days between two calendar dates: compare at UTC midnight so no zone can shift it
const toDay = (d) => Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
const daysBetween = (x, y) => Math.round((toDay(y) - toDay(x)) / 86400000);
console.log('days from 20/11/2026 to 01/01/2027 → ' + daysBetween(new Date(2026, 10, 20), new Date(2027, 0, 1)));

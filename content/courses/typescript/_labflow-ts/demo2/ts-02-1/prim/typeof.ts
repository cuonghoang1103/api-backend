// The seven primitive types of JavaScript, annotated — and what typeof says about each one at runtime.
const lab: string = 'BE-201';
const seats: number = 31;
const approved: boolean = false;
const bookingId: bigint = 9007199254740993n;
const tag: symbol = Symbol('booking');
const note: null = null;
const cancelledAt: undefined = undefined;

for (const value of [lab, seats, approved, bookingId, tag, note, cancelledAt]) {
  console.log(String(value).padEnd(18), typeof value);
}
console.log('[480, 600]'.padEnd(18), typeof [480, 600]);
console.log('{ seats: 31 }'.padEnd(18), typeof { seats: 31 });

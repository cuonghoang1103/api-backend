// A type error — and the file still runs.
const seats: number = '31';
const next = seats + 1;

console.log('seats + 1 =', next);
console.log('type at runtime:', typeof seats);

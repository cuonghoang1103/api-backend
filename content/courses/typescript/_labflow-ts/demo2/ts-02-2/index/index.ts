// The course tsconfig has noUncheckedIndexedAccess (lesson 1.2). Tuples and arrays answer differently.
type TimeRange = readonly [start: number, end: number];

const range: TimeRange = [480, 600];
const starts: readonly number[] = [480, 600, 780];

const a: number = range[0];     // a tuple KNOWS it has position 0
const b: number = starts[0];    // an array might be empty
console.log(a, b);

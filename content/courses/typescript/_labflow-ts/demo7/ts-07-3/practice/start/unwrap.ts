// unwrapArray should give the element type of an array type, but it is typed any.
type UnwrapArray<T> = any;

const a: UnwrapArray<string[]> = 'BE-201';
const n: UnwrapArray<number[]> = 'not a number'; // any accepts this — a bug
export { a, n };

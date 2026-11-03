// A clean file: tsc --noEmit type-checks it and writes no .js — the CI gate.
export function add(a: number, b: number): number { return a + b; }
console.log(add(2, 3));

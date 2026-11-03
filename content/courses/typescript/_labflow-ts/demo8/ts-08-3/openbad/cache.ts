const cache: Record<string, number> = { a: 1 };

// noUncheckedIndexedAccess: a string-keyed lookup might be undefined,
// so using it as a number without a guard is refused.
const n: number = cache['z'];
console.log(n);

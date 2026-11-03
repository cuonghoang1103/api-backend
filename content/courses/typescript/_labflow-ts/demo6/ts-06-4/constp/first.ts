// A `const` type parameter (TypeScript 5.0+) infers the narrowest type, as if the caller wrote `as const`.
function firstOf<const T>(arr: readonly T[]): T | undefined {
  return arr[0];
}

const b = firstOf(['BE-201', 'AL-301']);           // 'BE-201' | 'AL-301' | undefined — no as const needed
const check: 'BE-201' | 'AL-301' | undefined = b;
console.log(b, check);

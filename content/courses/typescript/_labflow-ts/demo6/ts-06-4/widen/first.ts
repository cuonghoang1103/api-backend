function firstOf<T>(arr: readonly T[]): T | undefined {
  return arr[0];
}

// A plain array literal widens its elements to string, so T = string.
const a = firstOf(['BE-201', 'AL-301']);          // string | undefined

// `as const` keeps the exact literals, so T = 'BE-201' | 'AL-301'.
const b = firstOf(['BE-201', 'AL-301'] as const); // 'BE-201' | 'AL-301' | undefined
const check: 'BE-201' | 'AL-301' | undefined = b; // only allowed because the literals were kept
console.log(a, b, check);

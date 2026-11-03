type Lab = { readonly code: string; readonly capacity: number };

// Remove the readonly modifier from every field.
type Mutable<T> = { -readonly [K in keyof T]: T[K] };

const frozen: Lab = { code: 'BE-201', capacity: 40 };
// frozen.capacity = 50;  // would be TS2540
const draft: Mutable<Lab> = { code: 'BE-201', capacity: 40 };
draft.capacity = 50;      // allowed — readonly was removed
console.log(frozen.capacity, draft.capacity);

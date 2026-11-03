function firstOf<T>(arr: T[]): T | undefined {
  return arr[0];
}

// An empty literal has nothing to infer T from, so T becomes never and the result is undefined:
// reading a property off it is an error.
const nothing = firstOf([]);        // never | undefined
const wrong = firstOf([]).length;   // TS2532 — the result is possibly undefined

// Give T explicitly when there is no value to infer it from.
const labs = firstOf<string>([]);   // string | undefined
console.log(nothing, labs);

// A conditional type: T extends U ? X : Y. It chooses a type based on T.
type IsArray<T> = T extends readonly unknown[] ? 'array' : 'single';

const a: IsArray<string[]> = 'array';   // string[] extends unknown[] → 'array'
const b: IsArray<number> = 'single';    // number does not → 'single'
const wrong: IsArray<number> = 'array'; // number resolves to 'single', not 'array'
export { a, b, wrong };

// Lesson 9.2 — the basic types, and the mistakes they catch
let count = 5;
count = 'five';                                      // 1. a number variable stays a number

let views: number[] = [120, 45];
views.push('300');                                   // 2. arrays have an element type

let id: number | string = 42;                        // a union: either one
id = 'abc-42';
console.log(id.toUpperCase());                       // fine here: TypeScript knows it is a string now

function format(value: number | string) {
  return value.toFixed(2);                           // 3. not every member of the union has toFixed
}
function formatOk(value: number | string) {
  if (typeof value === 'number') return value.toFixed(2);   // narrowing: inside, value is a number
  return value.trim();
}

type SortDir = 'asc' | 'desc';                       // a union of literal values
let dir: SortDir = 'asc';
dir = 'descending';                                  // 4. only the listed strings are allowed

const total = 10 + undefined;                        // 5. arithmetic with undefined

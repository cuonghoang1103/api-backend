function identity<T>(value: T): T {
  return value;
}

// You almost never write <T>: tsc infers it from the argument.
const a = identity(42);          // T = number, a: number
const b = identity('BE-201');    // T = string, b: string
const c = identity<boolean>(true); // explicit, when there is no argument to infer from

console.log(a.toFixed(0), b.toUpperCase(), c);

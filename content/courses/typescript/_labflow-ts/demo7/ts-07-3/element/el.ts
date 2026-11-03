// infer E captures a type inside a pattern: here the element type of an array.
type ElementType<T> = T extends readonly (infer E)[] ? E : T;

type A = ElementType<string[]>;   // string
type B = ElementType<number[]>;   // number
type C = ElementType<boolean>;    // boolean (not an array → T itself)

const x: A = 'BE-201';
const n: B = 42;
const bad: B = 'no';   // B is number
export { x, n, bad };
void (null as unknown as C);

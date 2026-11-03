type UnwrapArray<T> = T extends readonly (infer E)[] ? E : T;

const a: UnwrapArray<string[]> = 'BE-201';
const n: UnwrapArray<number[]> = 'not a number'; // now UnwrapArray<number[]> is number — refused
export { a, n };

type UnwrapArray<T> = T extends readonly (infer E)[] ? E : T;

const a: UnwrapArray<string[]> = 'BE-201';
const n: UnwrapArray<number[]> = 42;
console.log(a, n);

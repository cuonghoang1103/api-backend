// A conditional type distributes over a union: it is applied to each member separately.
type NoNull<T> = T extends null | undefined ? never : T;

type Clean = NoNull<string | null | undefined>;   // 'never | never | string' → string

const s: Clean = 'a note';
const bad: Clean = null;    // null was removed
export { s, bad };

// The top and the bottom of the type system, checked line by line.
declare const u: unknown;
declare const n: never;
declare const a: any;

// unknown is the TOP: every value fits into it…
const t1: unknown = 31;
const t2: unknown = 'BE-201';
const t3: unknown = null;
// …but it fits into nothing else until you check it.
const t4: string = u;

// never is the BOTTOM: it fits into every type…
const b1: string = n;
const b2: number = n;
// …and no value fits into it.
const b3: never = 31;

// any ignores the table in both directions (except into never).
const x1: string = a;
const x2: number = a;
const x3: never = a;

export { t1, t2, t3, t4, b1, b2, b3, x1, x2, x3 };

// never is the empty type: no value has it. It is assignable TO every type…
const toStr: string = fail();
const toNum: number = fail();

// …but only never is assignable to never — a leftover value is a compile error.
const leftover: 'PENDING' | 'CONFIRMED' = 'PENDING';
const bad: never = leftover;

function fail(): never {
  throw new Error('stops here');
}
void toStr; void toNum; void bad;

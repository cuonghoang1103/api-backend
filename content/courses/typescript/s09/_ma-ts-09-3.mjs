/**
 * _ma (bài 9.3) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "indexedFirst": `type Lab = { code: string };
const labs: Lab[] = [{ code: 'BE-201' }];

// noUncheckedIndexedAccess: labs[0] might be undefined, so reading .code is refused.
export function firstCode(): string {
  const first = labs[0];
  return first.code;
}`,
  "returnsGrade": `// noImplicitReturns: one path falls off the end without returning.
export function grade(score: number): string | undefined {
  if (score >= 5) {
    return 'PASS';
  }
  if (score < 0) {
    return 'INVALID';
  }
}`,
  "unusedCalc": `// noUnusedLocals: a declared-but-never-used local is an error.
export function total(xs: number[]): number {
  const count = xs.length;
  return xs.reduce((a, b) => a + b, 0);
}`,
  "prStart": `export function firstName(names: string[]): string {
  const first = names[0];
  return first.toUpperCase();
}`,
  "prSol": `export function firstName(names: string[]): string {
  const first = names[0];
  return (first ?? 'none').toUpperCase();
}
console.log(firstName(['an', 'binh']), firstName([]));`,
};
export const OUT = {
  '11-indexed': `$ node_modules/.bin/tsc -p demo9/ts-09-3/indexed
demo9/ts-09-3/indexed/first.ts(7,10): error TS18048: 'first' is possibly 'undefined'.`,
  '12-returns': `$ node_modules/.bin/tsc -p demo9/ts-09-3/returns
demo9/ts-09-3/returns/grade.ts(2,39): error TS7030: Not all code paths return a value.`,
  '13-unused': `$ node_modules/.bin/tsc -p demo9/ts-09-3/unused
demo9/ts-09-3/unused/calc.ts(3,9): error TS6133: 'count' is declared but its value is never read.`,
  '14-pr-start': `$ node_modules/.bin/tsc -p demo9/ts-09-3/practice/start
demo9/ts-09-3/practice/start/pick.ts(3,10): error TS18048: 'first' is possibly 'undefined'.`,
  '15-pr-sol': `$ node demo9/ts-09-3/practice/solution/pick.ts
AN NONE`,
};

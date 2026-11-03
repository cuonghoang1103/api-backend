/**
 * _ma (bài 16.1) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "brand": `// A branded type: a string the compiler tracks as a LabCode, not any string.
type LabCode = string & { readonly __brand: 'LabCode' };
function labCode(s: string): LabCode {
  if (!/^[A-Z]{2}-\\d{3}$/.test(s)) throw new Error('bad lab code: ' + s);
  return s as LabCode;
}
function book(code: LabCode): string { return 'booked ' + code; }
// You must go through the validator — a raw string is not a LabCode.
console.log(book(labCode('BE-201')));`,
  "wrongbrand": `type LabCode = string & { readonly __brand: 'LabCode' };
function book(code: LabCode): string { return 'booked ' + code; }
// A plain string is not a LabCode — it never went through the validator.
export const r = book('BE-201');`,
  "illegalstate": `// A discriminated union: a slot is free OR booked-by-someone, never both or neither.
type Slot = { kind: 'free' } | { kind: 'booked'; by: string };
export function who(s: Slot): string {
  // Reading 'by' without narrowing: a free slot has no 'by'.
  return s.by;
}`,
  "prStart": `type LabCode = string & { readonly __brand: 'LabCode' };
function labCode(s: string): LabCode { return s as LabCode; }
function book(code: LabCode): string { return 'booked ' + code; }
// A raw string is not a LabCode.
export const r = book('CS-101');`,
  "prSol": `type LabCode = string & { readonly __brand: 'LabCode' };
function labCode(s: string): LabCode { return s as LabCode; }
function book(code: LabCode): string { return 'booked ' + code; }
console.log(book(labCode('CS-101')));`,
};
export const OUT = {
  '11-brand': `$ node demo16/ts-16-1/brand/book.ts
booked BE-201`,
  '12-wrongbrand': `$ node_modules/.bin/tsc -p demo16/ts-16-1/wrongbrand
demo16/ts-16-1/wrongbrand/book.ts(4,23): error TS2345: Argument of type 'string' is not assignable to parameter of type 'LabCode'.
  Type 'string' is not assignable to type '{ readonly __brand: "LabCode"; }'.`,
  '13-illegalstate': `$ node_modules/.bin/tsc -p demo16/ts-16-1/illegalstate
demo16/ts-16-1/illegalstate/slot.ts(5,12): error TS2339: Property 'by' does not exist on type 'Slot'.
  Property 'by' does not exist on type '{ kind: "free"; }'.`,
  '14-pr-start': `$ node_modules/.bin/tsc -p demo16/ts-16-1/practice/start
demo16/ts-16-1/practice/start/book.ts(5,23): error TS2345: Argument of type 'string' is not assignable to parameter of type 'LabCode'.
  Type 'string' is not assignable to type '{ readonly __brand: "LabCode"; }'.`,
  '15-pr-sol': `$ node demo16/ts-16-1/practice/solution/book.ts
booked CS-101`,
};

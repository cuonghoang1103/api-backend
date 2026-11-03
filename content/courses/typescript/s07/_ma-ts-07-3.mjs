/**
 * _ma (bài 7.3) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "basicIs": `// A conditional type: T extends U ? X : Y. It chooses a type based on T.
type IsArray<T> = T extends readonly unknown[] ? 'array' : 'single';

const a: IsArray<string[]> = 'array';   // string[] extends unknown[] → 'array'
const b: IsArray<number> = 'single';    // number does not → 'single'
const wrong: IsArray<number> = 'array'; // number resolves to 'single', not 'array'
export { a, b, wrong };`,
  "elementEl": `// infer E captures a type inside a pattern: here the element type of an array.
type ElementType<T> = T extends readonly (infer E)[] ? E : T;

type A = ElementType<string[]>;   // string
type B = ElementType<number[]>;   // number
type C = ElementType<boolean>;    // boolean (not an array → T itself)

const x: A = 'BE-201';
const n: B = 42;
const bad: B = 'no';   // B is number
export { x, n, bad };
void (null as unknown as C);`,
  "retRet": `import { checkSlot } from '../../../src/rules/booking.ts';

// ReturnType, written out: infer the type after the arrow.
type Return<F> = F extends (...args: never[]) => infer R ? R : never;

type SlotR = Return<typeof checkSlot>;   // SlotResult

const r: SlotR = { ok: true, minutes: 120 };
console.log(r.ok ? r.minutes : 'refused');`,
  "distribNonull": `// A conditional type distributes over a union: it is applied to each member separately.
type NoNull<T> = T extends null | undefined ? never : T;

type Clean = NoNull<string | null | undefined>;   // 'never | never | string' → string

const s: Clean = 'a note';
const bad: Clean = null;    // null was removed
export { s, bad };`,
  "payloadPayload": `import type { EventPayloads, EventName } from '../../../src/rules/events.ts';

// infer the payload for a given event name out of the payload map.
type PayloadOf<E extends EventName> = EventPayloads extends Record<E, infer P> ? P : never;

const created: PayloadOf<'booking:created'> = { id: 1, lab: 'BE-201' };
const cancelled: PayloadOf<'booking:cancelled'> = { id: 1, reason: 'exam' };
console.log(created.lab, cancelled.reason);`,
  "prStart": `// unwrapArray should give the element type of an array type, but it is typed any.
type UnwrapArray<T> = any;

const a: UnwrapArray<string[]> = 'BE-201';
const n: UnwrapArray<number[]> = 'not a number'; // any accepts this — a bug
export { a, n };`,
  "prSol": `type UnwrapArray<T> = T extends readonly (infer E)[] ? E : T;

const a: UnwrapArray<string[]> = 'BE-201';
const n: UnwrapArray<number[]> = 42;
console.log(a, n);`,
};
export const OUT = {
  '11-basic': `$ npx tsc -p demo7/ts-07-3/basic
demo7/ts-07-3/basic/is.ts(6,7): error TS2322: Type '"array"' is not assignable to type '"single"'.`,
  '12-element': `$ npx tsc -p demo7/ts-07-3/element
demo7/ts-07-3/element/el.ts(10,7): error TS2322: Type 'string' is not assignable to type 'number'.`,
  '13-ret': `$ npx tsc -p demo7/ts-07-3/ret && node demo7/ts-07-3/ret/ret.ts
120`,
  '14-distrib': `$ npx tsc -p demo7/ts-07-3/distrib
demo7/ts-07-3/distrib/nonull.ts(7,7): error TS2322: Type 'null' is not assignable to type 'string'.`,
  '15-payload': `$ npx tsc -p demo7/ts-07-3/payload && node demo7/ts-07-3/payload/payload.ts
BE-201 exam`,
  '16-pr-start': `$ npx tsc -p demo7/ts-07-3/practice/start`,
  '17-pr-step1': `$ npx tsc -p demo7/ts-07-3/practice/step1
demo7/ts-07-3/practice/step1/unwrap.ts(4,7): error TS2322: Type 'string' is not assignable to type 'number'.`,
  '18-pr-sol': `$ npx tsc -p demo7/ts-07-3/practice/solution && node demo7/ts-07-3/practice/solution/unwrap.ts
BE-201 42`,
};

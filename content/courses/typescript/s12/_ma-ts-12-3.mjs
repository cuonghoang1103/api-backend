/**
 * _ma (bài 12.3) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "eventDemo": `import type { ChangeEvent } from './react.ts';
// The event is typed, so e.target.value is a string.
export function onLabChange(e: ChangeEvent): string {
  return e.target.value.toUpperCase();
}
console.log(onLabChange({ target: { value: 'be-201' } }));`,
  "wrongevent": `import type { ChangeEvent } from './react.ts';
export function onLabChange(e: ChangeEvent): string {
  // The event has target.value, not value directly.
  return e.value;
}`,
  "asnumber": `import type { ChangeEvent } from './react.ts';
export function onSeatsChange(e: ChangeEvent): number {
  // e.target.value is always a string — assigning it to a number is refused.
  const seats: number = e.target.value;
  return seats;
}`,
  "prStart": `import type { ChangeEvent } from './react.ts';
export function onSeatsChange(e: ChangeEvent): number {
  // e.target.value is a string — Number() converts it; reading e.value is wrong.
  return Number(e.value);
}`,
  "prSol": `import type { ChangeEvent } from './react.ts';
export function onSeatsChange(e: ChangeEvent): number {
  return Number(e.target.value);
}
console.log(onSeatsChange({ target: { value: '40' } }));`,
};
export const OUT = {
  '11-event': `$ node demo12/ts-12-3/event/change.ts
BE-201`,
  '12-wrongevent': `$ node_modules/.bin/tsc -p demo12/ts-12-3/wrongevent
demo12/ts-12-3/wrongevent/change.ts(4,12): error TS2339: Property 'value' does not exist on type 'ChangeEvent'.`,
  '13-asnumber': `$ node_modules/.bin/tsc -p demo12/ts-12-3/asnumber
demo12/ts-12-3/asnumber/change.ts(4,9): error TS2322: Type 'string' is not assignable to type 'number'.`,
  '14-pr-start': `$ node_modules/.bin/tsc -p demo12/ts-12-3/practice/start
demo12/ts-12-3/practice/start/change.ts(4,19): error TS2339: Property 'value' does not exist on type 'ChangeEvent'.`,
  '15-pr-sol': `$ node demo12/ts-12-3/practice/solution/change.ts
40`,
};

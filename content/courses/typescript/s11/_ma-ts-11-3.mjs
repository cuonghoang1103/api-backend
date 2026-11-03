/**
 * _ma (bài 11.3) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "apiEnv": `// A result envelope: every response is a success with data or a failure with an error.
export type ApiOk<T> = { ok: true; data: T };
export type ApiErr = { ok: false; error: { code: string; message: string } };
export type ApiResult<T> = ApiOk<T> | ApiErr;`,
  "envelopeHandler": `import type { ApiResult } from './api.ts';
type Booking = { id: string; seats: number };

export function findBooking(id: string): ApiResult<Booking> {
  if (id === 'bk_1') return { ok: true, data: { id, seats: 40 } };
  return { ok: false, error: { code: 'NOT_FOUND', message: 'No such booking' } };
}

const r = findBooking('bk_1');
// The discriminant narrows the union — data is only reachable on the ok branch.
if (r.ok) console.log(r.data.seats);
else console.log(r.error.code);`,
  "wrongbranchHandler": `import type { ApiResult } from './api.ts';
type Booking = { id: string; seats: number };
export function read(r: ApiResult<Booking>): number {
  // Reading data without checking ok — it does not exist on the error branch.
  return r.data.seats;
}`,
  "prStart": `import type { ApiResult } from './api.ts';
type Lab = { code: string };
export function labName(r: ApiResult<Lab>): string {
  // Reading data.code without narrowing on ok.
  return r.data.code;
}`,
  "prSol": `import type { ApiResult } from './api.ts';
type Lab = { code: string };
export function labName(r: ApiResult<Lab>): string {
  return r.ok ? r.data.code : r.error.message;
}
console.log(labName({ ok: true, data: { code: 'BE-201' } }));`,
};
export const OUT = {
  '11-envelope': `$ node demo11/ts-11-3/envelope/handler.ts
40`,
  '12-wrongbranch': `$ node_modules/.bin/tsc -p demo11/ts-11-3/wrongbranch
demo11/ts-11-3/wrongbranch/handler.ts(5,12): error TS2339: Property 'data' does not exist on type 'ApiResult<Booking>'.
  Property 'data' does not exist on type 'ApiErr'.`,
  '13-pr-start': `$ node_modules/.bin/tsc -p demo11/ts-11-3/practice/start
demo11/ts-11-3/practice/start/handler.ts(5,12): error TS2339: Property 'data' does not exist on type 'ApiResult<Lab>'.
  Property 'data' does not exist on type 'ApiErr'.`,
  '14-pr-sol': `$ node demo11/ts-11-3/practice/solution/handler.ts
BE-201`,
};

/**
 * _ma (bài 11.2) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "responseSend": `import type { Handler } from './http.ts';
import { fakeReq, fakeRes } from './run.ts';

type Booking = { id: string; lab: string; seats: number };
// The response body is typed Booking, so res.json checks the shape.
export const getBooking: Handler<{ id: string }, {}, unknown, Booking> = (req, res) => {
  res.status(200).json({ id: req.params.id, lab: 'BE-201', seats: 40 });
};
const sink: { body?: Booking } = {};
getBooking(fakeReq({ params: { id: 'bk_1' } }), fakeRes(sink));
console.log(sink.body);`,
  "wrongbodySend": `import type { Handler } from './http.ts';
type Booking = { id: string; lab: string; seats: number };
export const getBooking: Handler<{ id: string }, {}, unknown, Booking> = (req, res) => {
  // seats must be a number — a string is refused by the typed response.
  res.status(200).json({ id: req.params.id, lab: 'BE-201', seats: 'forty' });
};`,
  "prStart": `import type { Handler } from './http.ts';
type Lab = { code: string; seats: number };
export const getLab: Handler<{ id: string }, {}, unknown, Lab> = (req, res) => {
  // The response is missing the seats field.
  res.status(200).json({ code: 'BE-201' });
};`,
  "prSol": `import type { Handler } from './http.ts';
import { fakeReq, fakeRes } from './run.ts';
type Lab = { code: string; seats: number };
export const getLab: Handler<{ id: string }, {}, unknown, Lab> = (req, res) => {
  res.status(200).json({ code: 'BE-201', seats: 40 });
};
const sink: { body?: Lab } = {};
getLab(fakeReq({ params: { id: 'x' } }), fakeRes(sink));
console.log(sink.body);`,
};
export const OUT = {
  '11-response': `$ node demo11/ts-11-2/response/send.ts
{ id: 'bk_1', lab: 'BE-201', seats: 40 }`,
  '12-wrongbody': `$ node_modules/.bin/tsc -p demo11/ts-11-2/wrongbody
demo11/ts-11-2/wrongbody/send.ts(5,60): error TS2322: Type 'string' is not assignable to type 'number'.`,
  '13-pr-start': `$ node_modules/.bin/tsc -p demo11/ts-11-2/practice/start
demo11/ts-11-2/practice/start/send.ts(5,24): error TS2741: Property 'seats' is missing in type '{ code: string; }' but required in type 'Lab'.`,
  '14-pr-sol': `$ node demo11/ts-11-2/practice/solution/send.ts
{ code: 'BE-201', seats: 40 }`,
};

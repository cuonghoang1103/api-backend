/**
 * _ma (bài 11.1) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "httpModel": `// A tiny typed model of an Express-style request/response (the shape @types/express provides).
export type Req<P = {}, Q = {}, B = unknown> = {
  params: P;
  query: Q;
  body: B;
};
export type Res<T> = {
  status(code: number): Res<T>;
  json(body: T): void;
};
export type Handler<P = {}, Q = {}, B = unknown, T = unknown> = (req: Req<P, Q, B>, res: Res<T>) => void;`,
  "handlerGet": `import type { Handler } from './http.ts';
import { fakeReq, fakeRes } from './run.ts';

type Params = { id: string };
// The handler's params are typed, so req.params.id is a string.
export const getBooking: Handler<Params, {}, unknown, { id: string }> = (req, res) => {
  res.status(200).json({ id: req.params.id });
};

const sink: { body?: { id: string } } = {};
getBooking(fakeReq({ params: { id: 'bk_42' } }), fakeRes(sink));
console.log(sink.body);`,
  "wrongparamGet": `import type { Handler } from './http.ts';
type Params = { id: string };
export const getBooking: Handler<Params> = (req, res) => {
  // 'labId' is not a declared param — the typed request refuses it.
  res.status(200).json({ labId: req.params.labId });
};`,
  "prStart": `import type { Handler } from './http.ts';
type Params = { id: string };
// req.params is typed, so reading a param that was not declared is refused.
export const getLab: Handler<Params> = (req, res) => {
  res.status(200).json({ code: req.params.code });
};`,
  "prSol": `import type { Handler } from './http.ts';
import { fakeReq, fakeRes } from './run.ts';
type Params = { id: string };
export const getLab: Handler<Params, {}, unknown, { id: string }> = (req, res) => {
  res.status(200).json({ id: req.params.id });
};
const sink: { body?: { id: string } } = {};
getLab(fakeReq({ params: { id: 'BE-201' } }), fakeRes(sink));
console.log(sink.body);`,
};
export const OUT = {
  '11-handler': `$ node demo11/ts-11-1/handler/get.ts
{ id: 'bk_42' }`,
  '12-wrongparam': `$ node_modules/.bin/tsc -p demo11/ts-11-1/wrongparam
demo11/ts-11-1/wrongparam/get.ts(5,44): error TS2339: Property 'labId' does not exist on type 'Params'.`,
  '13-pr-start': `$ node_modules/.bin/tsc -p demo11/ts-11-1/practice/start
demo11/ts-11-1/practice/start/get.ts(5,43): error TS2339: Property 'code' does not exist on type 'Params'.`,
  '14-pr-sol': `$ node demo11/ts-11-1/practice/solution/get.ts
{ id: 'BE-201' }`,
};

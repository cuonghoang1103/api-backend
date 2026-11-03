import type { Handler } from './http.ts';
import { fakeReq, fakeRes } from './run.ts';
type Lab = { code: string; seats: number };
export const getLab: Handler<{ id: string }, {}, unknown, Lab> = (req, res) => {
  res.status(200).json({ code: 'BE-201', seats: 40 });
};
const sink: { body?: Lab } = {};
getLab(fakeReq({ params: { id: 'x' } }), fakeRes(sink));
console.log(sink.body);

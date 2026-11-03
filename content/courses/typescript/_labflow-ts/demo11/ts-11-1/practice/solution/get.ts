import type { Handler } from './http.ts';
import { fakeReq, fakeRes } from './run.ts';
type Params = { id: string };
export const getLab: Handler<Params, {}, unknown, { id: string }> = (req, res) => {
  res.status(200).json({ id: req.params.id });
};
const sink: { body?: { id: string } } = {};
getLab(fakeReq({ params: { id: 'BE-201' } }), fakeRes(sink));
console.log(sink.body);

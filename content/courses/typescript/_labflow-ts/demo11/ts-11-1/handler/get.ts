import type { Handler } from './http.ts';
import { fakeReq, fakeRes } from './run.ts';

type Params = { id: string };
// The handler's params are typed, so req.params.id is a string.
export const getBooking: Handler<Params, {}, unknown, { id: string }> = (req, res) => {
  res.status(200).json({ id: req.params.id });
};

const sink: { body?: { id: string } } = {};
getBooking(fakeReq({ params: { id: 'bk_42' } }), fakeRes(sink));
console.log(sink.body);

import type { Handler } from './http.ts';
import { fakeReq, fakeRes } from './run.ts';

type Booking = { id: string; lab: string; seats: number };
// The response body is typed Booking, so res.json checks the shape.
export const getBooking: Handler<{ id: string }, {}, unknown, Booking> = (req, res) => {
  res.status(200).json({ id: req.params.id, lab: 'BE-201', seats: 40 });
};
const sink: { body?: Booking } = {};
getBooking(fakeReq({ params: { id: 'bk_1' } }), fakeRes(sink));
console.log(sink.body);

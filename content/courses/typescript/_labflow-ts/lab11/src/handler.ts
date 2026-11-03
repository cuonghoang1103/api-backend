import type { Handler } from './http.ts';
import type { ApiResult } from './api.ts';

// A teammate stubbed the types with any — it compiles and does not validate.
export type CreateBooking = any;
export type Booking = any;

export const createBooking: Handler<{}, {}, CreateBooking, ApiResult<Booking>> = (req, res) => {
  res.status(201).json({ ok: true, data: req.body });
};

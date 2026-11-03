import type { Handler } from './http.ts';
import type { ApiResult } from './api.ts';

export type CreateBooking = { lab: string; seats: number; purpose: string };
export type Booking = any;

export const createBooking: Handler<{}, {}, CreateBooking, ApiResult<Booking>> = (req, res) => {
  const { lab, seats, purpose } = req.body;
  if (seats <= 0) {
    res.status(400).json({ ok: false, error: { code: 'INVALID_SEATS', message: 'seats must be positive' } });
    return;
  }
  res.status(201).json({ ok: true, data: { id: 'bk_1', lab, seats, purpose, status: 'PENDING' } });
};

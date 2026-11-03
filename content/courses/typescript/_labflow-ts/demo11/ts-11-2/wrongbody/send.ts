import type { Handler } from './http.ts';
type Booking = { id: string; lab: string; seats: number };
export const getBooking: Handler<{ id: string }, {}, unknown, Booking> = (req, res) => {
  // seats must be a number — a string is refused by the typed response.
  res.status(200).json({ id: req.params.id, lab: 'BE-201', seats: 'forty' });
};

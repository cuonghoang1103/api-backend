import type { Handler } from './http.ts';
type Params = { id: string };
export const getBooking: Handler<Params> = (req, res) => {
  // 'labId' is not a declared param — the typed request refuses it.
  res.status(200).json({ labId: req.params.labId });
};

import type { Handler } from './http.ts';
type Lab = { code: string; seats: number };
export const getLab: Handler<{ id: string }, {}, unknown, Lab> = (req, res) => {
  // The response is missing the seats field.
  res.status(200).json({ code: 'BE-201' });
};

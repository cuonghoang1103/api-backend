import type { Handler } from './http.ts';
type Params = { id: string };
// req.params is typed, so reading a param that was not declared is refused.
export const getLab: Handler<Params> = (req, res) => {
  res.status(200).json({ code: req.params.code });
};

// A tiny typed model of an Express-style request/response (the shape @types/express provides).
export type Req<P = {}, Q = {}, B = unknown> = {
  params: P;
  query: Q;
  body: B;
};
export type Res<T> = {
  status(code: number): Res<T>;
  json(body: T): void;
};
export type Handler<P = {}, Q = {}, B = unknown, T = unknown> = (req: Req<P, Q, B>, res: Res<T>) => void;

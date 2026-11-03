import type { Req, Res } from './http.ts';
export function fakeRes<T>(sink: { body?: T; code?: number }): Res<T> {
  return {
    status(code) { sink.code = code; return this; },
    json(body) { sink.body = body; },
  };
}
export function fakeReq<P, Q, B>(parts: { params?: P; query?: Q; body?: B }): Req<P, Q, B> {
  return { params: (parts.params ?? {}) as P, query: (parts.query ?? {}) as Q, body: (parts.body as B) };
}

// loi.js — errors the API answers on purpose, and how Prisma/PostgreSQL errors become HTTP status codes.
import { Prisma } from '@prisma/client';

export class LoiApi extends Error {
  constructor(status, code, message, extra = {}) { super(message); this.status = status; this.code = code; this.extra = extra; }
}

// Express 5: an error thrown (or a rejected promise) in an async handler lands here — no try/catch per route.
export function xuLyLoi(err, req, res, _next) {
  if (err instanceof LoiApi) return res.status(err.status).json({ error: err.code, message: err.message, ...err.extra });
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // TODO C6 · when the pool is exhausted the load test gets 500s — which Prisma codes are they? Answer 503 + a clear error.
    if (err.code === 'P2002') return res.status(409).json({ error: 'DUPLICATE', message: `already exists (${err.meta?.target})` });
    if (err.code === 'P2003') return res.status(400).json({ error: 'BAD_REFERENCE', message: `unknown ${err.meta?.field_name}` });
    if (err.code === 'P2025') return res.status(404).json({ error: 'NOT_FOUND', message: 'not found' });
  }
  // TODO C7 · a write that waited too long for a lock (role lock_timeout) also lands here as a 500: give it a 503.
  console.error(err);
  res.status(500).json({ error: 'INTERNAL', message: 'internal error' });
}

// Small input checks (a real app would use zod or similar).
export function soNguyen(v, ten, { min = 1, max = Number.MAX_SAFE_INTEGER } = {}) {
  if (v === undefined || v === null || v === '') return undefined;
  if (!/^\d+$/.test(String(v))) throw new LoiApi(400, 'BAD_INPUT', `${ten} must be a whole number`);
  const n = Number(v);
  if (n < min || n > max) throw new LoiApi(400, 'BAD_INPUT', `${ten} must be between ${min} and ${max}`);
  return n;
}

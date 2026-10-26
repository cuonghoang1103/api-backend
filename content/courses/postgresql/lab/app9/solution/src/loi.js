// loi.js — errors the API answers on purpose, and how Prisma/PostgreSQL errors become HTTP status codes.
import { Prisma } from '@prisma/client';

export class LoiApi extends Error {
  constructor(status, code, message, extra = {}) { super(message); this.status = status; this.code = code; this.extra = extra; }
}

// Express 5: an error thrown (or a rejected promise) in an async handler lands here — no try/catch per route.
export function xuLyLoi(err, req, res, _next) {
  if (err instanceof LoiApi) return res.status(err.status).json({ error: err.code, message: err.message, ...err.extra });
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // the pool is exhausted: P2024 = a query waited longer than pool_timeout · P2028 = $transaction waited longer than maxWait
    if (err.code === 'P2024') return res.status(503).json({ error: 'POOL_TIMEOUT', message: 'no free database connection — try again' });
    if (err.code === 'P2028') return res.status(503).json({ error: 'TX_START_TIMEOUT', message: 'could not start a transaction in time — try again' });
    if (err.code === 'P2034') return res.status(409).json({ error: 'CONFLICT', message: 'the order collided with another one — try again' });
    if (err.code === 'P2002') return res.status(409).json({ error: 'DUPLICATE', message: `already exists (${err.meta?.target})` });
    if (err.code === 'P2003') return res.status(400).json({ error: 'BAD_REFERENCE', message: `unknown ${err.meta?.field_name}` });
    if (err.code === 'P2025') return res.status(404).json({ error: 'NOT_FOUND', message: 'not found' });
  }
  // Errors Prisma 5.22 does not name (no .code): the SQLSTATE is only inside the message text.
  const sqlstate = err instanceof Prisma.PrismaClientUnknownRequestError ? /code: "(\w{5})"/.exec(err.message)?.[1] : undefined;
  if (sqlstate === '40P01') return res.status(409).json({ error: 'CONFLICT', message: 'deadlock — try again' });
  if (sqlstate === '55P03') return res.status(503).json({ error: 'LOCK_TIMEOUT', message: 'the table is locked (a migration?) — try again' });
  if (sqlstate === '57014') return res.status(503).json({ error: 'STATEMENT_TIMEOUT', message: 'the query took too long' });
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

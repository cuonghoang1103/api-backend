// src/log.js — lesson 1.5: one request line per request, built from an ALLOW-list. Credentials never reach the log.
import pino from 'pino';
import { redact } from './crypto/index.js';

export const log = pino({ base: null });

const SAFE = ['method', 'path', 'status', 'ms', 'ip', 'headers', 'user-agent', 'content-type', 'body', 'email'];

export function requestLog(req, res, next) {
  const start = performance.now();
  res.on('finish', () => {
    log.info(redact({
      method: req.method,
      path: req.path, // never originalUrl: the query string may carry a token (lesson 1.1)
      status: res.statusCode,
      ms: Math.round(performance.now() - start),
      ip: req.ip,
      headers: req.headers,
      body: req.body ?? null,
    }, SAFE), 'request');
  });
  next();
}

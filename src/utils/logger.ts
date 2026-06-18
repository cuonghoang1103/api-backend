/**
 * Minimal structured logger.
 *
 * Wraps console.* with a stable prefix and JSON-formatted lines
 * in production so log shippers (Cloudflare Logpush, Vector,
 * Promtail) can pick the fields up automatically. In dev we
 * keep the human-friendly output so contributors can read it.
 */
import { config } from '../config/env.js';

type Level = 'debug' | 'info' | 'warn' | 'error';

function emit(level: Level, message: string, context?: Record<string, unknown>): void {
  if (level === 'debug' && config.nodeEnv === 'production') return;
  const record = {
    ts: new Date().toISOString(),
    level,
    msg: message,
    ...(context || {}),
  };
  const line = config.nodeEnv === 'production'
    ? JSON.stringify(record)
    : `[${record.ts}] ${level.toUpperCase().padEnd(5)} ${message}` +
      (context ? ' ' + JSON.stringify(context) : '');

  if (level === 'error') {
    console.error(line);
  } else if (level === 'warn') {
    console.warn(line);
  } else {
    console.log(line);
  }
}

export const logger = {
  debug: (msg: string, ctx?: Record<string, unknown>) => emit('debug', msg, ctx),
  info: (msg: string, ctx?: Record<string, unknown>) => emit('info', msg, ctx),
  warn: (msg: string, ctx?: Record<string, unknown>) => emit('warn', msg, ctx),
  error: (msg: string, ctx?: Record<string, unknown>) => emit('error', msg, ctx),
};

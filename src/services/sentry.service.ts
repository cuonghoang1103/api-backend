/**
 * Sentry integration for the Node/Express backend.
 *
 * Design goals:
 * - **Zero overhead when disabled**: if `SENTRY_DSN` is empty, all
 *   exported helpers are no-ops. We never want Sentry to slow down
 *   the hot path when it's not configured.
 * - **Never crash the app**: every Sentry call is wrapped in a
 *   try/catch so a flaky Sentry ingest endpoint can't bring down
 *   the API.
 * - **Privacy first**: we strip cookies, authorization headers,
 *   and request bodies before sending them to Sentry. PII like
 *   passwords, JWTs, and email addresses is never included in
 *   event payloads.
 * - **Single source of truth**: `initSentry()` is called exactly
 *   once at process startup (see `src/index.ts`).
 *
 * Express integration: we use `Sentry.setupExpressErrorHandler(app)`
 * AFTER all routes are registered (see `src/index.ts`). The
 * integration automatically wraps async route handlers and reports
 * their rejections to Sentry.
 */
import * as Sentry from '@sentry/node';
import type { Express, Request, Response, NextFunction } from 'express';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

let initialized = false;

export function initSentry(): void {
  if (initialized) return;
  if (!config.sentryDsn) {
    // DSN not configured → Sentry disabled. Don't touch the SDK so
    // SDK calls become cheap no-ops and we don't accidentally send
    // events somewhere.
    return;
  }

  try {
    Sentry.init({
      dsn: config.sentryDsn,
      environment: config.sentryEnvironment,
      release: config.sentryRelease || undefined,
      // Sample 10% of transactions for performance monitoring. The
      // default (1.0) is too aggressive for a public-facing API.
      tracesSampleRate: config.sentryTracesSampleRate,
      // Don't send PII to Sentry — we don't need names/emails/IPs to
      // debug errors, and storing them creates GDPR concerns.
      sendDefaultPii: false,
      // Strip sensitive headers + bodies before sending.
      beforeSendTransaction(event) {
        if (event.request) {
          delete event.request.cookies;
          if (event.request.headers) {
            delete event.request.headers.authorization;
            delete event.request.headers.cookie;
          }
        }
        return event;
      },
      beforeSend(event) {
        if (event.request) {
          delete event.request.cookies;
          if (event.request.headers) {
            delete event.request.headers.authorization;
            delete event.request.headers.cookie;
          }
          // Don't send request bodies — they may contain passwords.
          if (event.request.data) {
            event.request.data = '[REDACTED]';
          }
        }
        if (event.user) {
          delete event.user.email;
          delete event.user.username;
          delete event.user.ip_address;
        }
        return event;
      },
    });
 initialized = true;
 logger.info('Sentry initialized', { environment: config.sentryEnvironment, release: config.sentryRelease || undefined });
 } catch (err) {
 // Never let Sentry init failure take down the server.
 logger.error('Sentry init failed', { error: err instanceof Error ? err.message : String(err) });
 }
}

/**
 * Wire Sentry's Express handlers into the app. Call this:
 * 1. `setupSentryRequestHandler(app)` BEFORE all routes — creates
 *    a transaction for every request and attaches the user/IP
 *    context. (We also call `sentryRequestMiddleware` later to tag
 *    the transaction with the route template.)
 * 2. `setupSentryErrorHandler(app)` AFTER all routes + 404 handler,
 *    BEFORE the global error handler — auto-captures thrown errors
 *    with the full request context.
 *
 * These are the v7-era handler names; v8 collapses them into a
 * single `setupExpressErrorHandler`. See SENTRY_SETUP.md for the
 * upgrade path.
 *
 * Safe to call when Sentry is disabled (early return).
 */
export function setupSentryRequestHandler(app: Express): void {
  if (!initialized) return;
  try {
 app.use(Sentry.Handlers.requestHandler());
 } catch (err) {
 logger.error('Sentry requestHandler failed', { error: err instanceof Error ? err.message : String(err) });
 }
}

export function setupSentryErrorHandler(app: Express): void {
  if (!initialized) return;
  try {
 app.use(Sentry.Handlers.errorHandler());
 } catch (err) {
 logger.error('Sentry errorHandler failed', { error: err instanceof Error ? err.message : String(err) });
 }
}

/**
 * Tag the current Sentry transaction with the authenticated user
 * id. Call this from auth middleware once we know who the user
 * is, so error events carry `user.id` for searching. We only set
 * the id, never email/ip, to stay GDPR-safe.
 */
export function setUser(userId: string | number | null): void {
  if (!initialized) return;
  try {
    if (userId == null) {
      Sentry.setUser(null);
    } else {
      Sentry.setUser({ id: String(userId) });
    }
  } catch {
    /* swallow */
  }
}

/**
 * Lightweight request middleware that starts a Sentry transaction
 * span for each incoming request. Use this BEFORE all routes for
 * the most accurate performance traces. Safe when Sentry is
 * disabled (early return, no overhead).
 */
export function sentryRequestMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  if (!initialized) {
    next();
    return;
  }
  try {
    // The Express integration already creates transactions for
    // every request, but this hook lets us tag with the route
    // template (e.g. /api/v1/courses/:id) instead of the raw URL
    // (which would explode the transaction list with one entry
    // per course id).
    Sentry.getCurrentHub().configureScope((scope) => {
      const route = (req.route?.path as string) || req.path;
      if (route) {
        scope.setTag('route', route);
      }
    });
  } catch {
    /* swallow */
  }
  next();
}

/**
 * Report a caught exception. Safe to call from anywhere — no-op if
 * Sentry is disabled, and never throws.
 */
export function captureException(
  err: unknown,
  context?: Record<string, unknown>,
): void {
  if (!initialized) return;
  try {
    if (context) {
      Sentry.withScope((scope) => {
        for (const [key, value] of Object.entries(context)) {
          scope.setExtra(key, value);
        }
        Sentry.captureException(err);
      });
    } else {
      Sentry.captureException(err);
    }
  } catch {
    /* swallow */
  }
}

/**
 * Capture a non-fatal message. Useful for tracking API errors that
 * we handled gracefully but want visibility into.
 */
export function captureMessage(
  message: string,
  level: Sentry.SeverityLevel = 'info',
  context?: Record<string, unknown>,
): void {
  if (!initialized) return;
  try {
    if (context) {
      Sentry.withScope((scope) => {
        for (const [key, value] of Object.entries(context)) {
          scope.setExtra(key, value);
        }
        Sentry.captureMessage(message, level);
      });
    } else {
      Sentry.captureMessage(message, level);
    }
  } catch {
    /* swallow */
  }
}

/**
 * Set a tag on the current scope. Tags are searchable in Sentry's
 * UI and help slice errors by environment / route / etc.
 */
export function setTag(key: string, value: string): void {
  if (!initialized) return;
  try {
    Sentry.setTag(key, value);
  } catch {
    /* swallow */
  }
}

/**
 * Flush pending events before shutdown so we don't drop in-flight
 * error reports when the process exits.
 */
export async function flushSentry(timeoutMs = 2000): Promise<void> {
  if (!initialized) return;
  try {
    await Sentry.flush(timeoutMs);
  } catch {
    /* swallow */
  }
}

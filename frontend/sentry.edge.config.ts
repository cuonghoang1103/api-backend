/**
 * Sentry configuration for the Next.js **edge** runtime.
 *
 * Edge runtime is used by middleware and any page marked
 * `export const runtime = 'edge'`. It runs in a different V8
 * isolate from the Node server, so it needs its own Sentry init.
 *
 * The middleware here does auth + admin redirect logic, so the
 * edge SDK is the first place to catch a broken redirect loop.
 */
import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV,
    release: process.env.SENTRY_RELEASE || undefined,
    tracesSampleRate:
      process.env.NODE_ENV === 'development'
        ? 1.0
        : parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '0.1'),
    sendDefaultPii: false,
  });
}

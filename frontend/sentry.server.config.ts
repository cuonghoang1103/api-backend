/**
 * Sentry configuration for the Next.js **server** runtime.
 *
 * Captures errors that happen during SSR / API route handlers /
 * Server Actions. Hydration mismatches (React #418, #423) throw
 * here first, so the server SDK is where we get the cleanest
 * signal for SSR-side bugs.
 *
 * `includeLocalVariables: true` (server-only) is the only new
 * option versus the client SDK. It attaches the values of
 * variables in scope at the time of the throw, so the stack
 * trace shows e.g. `courseId = 42` instead of just
 * `courseId is not defined`. Server bundle only — never enable
 * on the client because it leaks variables into replays.
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
    // Attach local variable values to stack frames. Server only —
    // never enable on the client (would leak through Replays).
    includeLocalVariables: true,
    integrations: (defaults) =>
      defaults.filter((integration) => integration.name !== 'Console'),
    beforeSend(event) {
      if (event.request) {
        delete event.request.cookies;
        if (event.request.headers) {
          delete event.request.headers.authorization;
          delete event.request.headers.cookie;
        }
        // Don't ship request bodies — they may contain passwords.
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
}

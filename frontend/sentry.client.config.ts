/**
 * Sentry configuration for the Next.js **client** (browser) runtime.
 *
 * Loaded by `withSentryConfig()` in next.config.js. Captures:
 *   - Unhandled exceptions
 *   - Unhandled promise rejections
 *   - React render errors (via Error Boundary)
 *   - Session replays (on error, full buffer; session, 10% sample)
 *   - App Router navigation transitions (Next.js 14+)
 *
 * Privacy:
 *   - We strip URL query params (often contain JWTs in this app).
 *   - Replay masks all text + inputs by default.
 *   - We DO NOT enable `sendDefaultPii` (no IPs, no user email).
 *
 * Why a browser-only Replay integration lives here (not in
 * server/edge configs): the DOM doesn't exist on the server,
 * and bundling Replay into the server bundle would bloat the
 * edge runtime past its size budget.
 */
import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment:
      process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.NODE_ENV,
    release: process.env.NEXT_PUBLIC_SENTRY_RELEASE || undefined,
    // Sample 10% of page loads in prod. 100% in dev for easier debugging.
    tracesSampleRate:
      process.env.NODE_ENV === 'development'
        ? 1.0
        : parseFloat(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE || '0.1'),
    // Session Replay: 10% of sessions, 100% of error sessions.
    // Skill recommends 0.10 / 1.0 for sites with 10k-100k daily sessions.
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    // We disable PII by default. The skill uses `sendDefaultPii: true`
    // but this site has user data we don't want shipped to Sentry.
    sendDefaultPii: false,
    integrations: [
      Sentry.replayIntegration({
        // Default: mask all text + block all media. We don't override
        // because the app has chat messages, usernames, and avatars
        // everywhere — better safe than sorry.
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    // Strip query params (often contain tokens) before sending.
    beforeSendTransaction(event) {
      if (event.request?.url) {
        try {
          const u = new URL(event.request.url);
          u.search = '';
          event.request.url = u.toString();
        } catch {
          /* malformed URL — leave as-is */
        }
      }
      return event;
    },
    // Strip PII from error events.
    beforeSend(event) {
      if (event.user) {
        // Don't send the user's email or username to Sentry.
        delete event.user.email;
        delete event.user.username;
        delete event.user.ip_address;
      }
      if (event.request?.url) {
        try {
          const u = new URL(event.request.url);
          u.search = '';
          event.request.url = u.toString();
        } catch {
          /* ignore */
        }
      }
      return event;
    },
  });
}

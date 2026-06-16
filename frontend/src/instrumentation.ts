/**
 * Next.js instrumentation hook. Called exactly once when the
 * Next.js server boots, before any request is handled.
 *
 * Sentry's `withSentryConfig` webpack plugin requires the
 * `sentry.{client,server,edge}.config.{ts,js}` files to live at
 * the project root (next to `next.config.js`). They do not sit
 * inside `src/` because the plugin uses a fixed path to locate
 * them. We import them by relative path here so the runtime can
 * initialise the SDK in the right V8 isolate.
 *
 * Note: `@sentry/nextjs` ≥8.28.0 exposes `Sentry.captureRequestError`
 * which auto-captures all unhandled server-side request errors.
 * We're pinned to v7.120.4 for Next.js 14.2 compatibility, so we
 * rely on the existing `error.tsx` / `global-error.tsx` boundaries
 * for capture.
 *
 * Reference: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server runtime (SSR + API routes + Server Actions).
    await import('../sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge runtime (middleware, edge API routes).
    await import('../sentry.edge.config');
  }
}

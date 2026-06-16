'use client';

/**
 * Root-level error boundary. This only fires for errors thrown
 * inside `app/layout.tsx` — anything below the root layout is
 * handled by `app/error.tsx`.
 *
 * Per the Sentry Next.js skill, we render `NextError` so the
 * browser still displays Next.js's default error UI (with the
 * status code + helpful message) while we capture the
 * exception in the background. The `statusCode={0}` is a
 * convention meaning "unknown / server-thrown error" because
 * client error boundaries don't have an HTTP status code.
 */
import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import NextError from 'next/error';

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error, {
      tags: { source: 'global-error' },
      extra: { digest: error.digest },
    });
  }, [error]);

  return (
    <html>
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  );
}

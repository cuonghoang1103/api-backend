'use client';

import { useEffect } from 'react';
import { AlertTriangle, RotateCw } from 'lucide-react';

/**
 * App-wide error boundary. Any client-side exception that bubbles up
 * from a route will land here instead of producing the white
 * "Application error: a client-side exception has occurred" page.
 *
 * Next.js requires this file to be a client component; the `error`
 * prop is the Error that was thrown (or, in some framework cases, a
 * string — we coerce defensively).
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Forward to the browser console so devs can still see the stack
    // even though we're rendering a friendly fallback.
    // eslint-disable-next-line no-console
    console.error('[AppErrorBoundary]', error);
  }, [error]);

  const message = (() => {
    if (error?.message) return error.message;
    if (typeof error === 'string') return error;
    return 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.';
  })();

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-darkcard border border-darkborder rounded-2xl p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">
          Đã xảy ra lỗi
        </h1>
        <p className="text-text-secondary text-sm leading-relaxed mb-4 break-words">
          {message}
        </p>
        {error?.digest && (
          <p className="text-xs text-text-muted font-mono mb-6">Mã lỗi: {error.digest}</p>
        )}
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-medium text-sm hover:opacity-90 transition-opacity"
        >
          <RotateCw className="w-4 h-4" /> Thử lại
        </button>
      </div>
    </div>
  );
}

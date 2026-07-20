'use client';

/**
 * Reports each page view to our own analytics endpoint.
 *
 * Why a client component and not a server middleware: this is a Next.js app, so
 * most navigation never reaches the server — a request log would miss almost
 * every page after the first and quietly under-report by an order of magnitude.
 * Listening to the router is the only way to see what a visitor actually did.
 *
 * The session id lives in `sessionStorage`, not a cookie: it dies with the tab,
 * is never sent anywhere else, and is not tied to an identity. It exists purely
 * so one person reading five pages doesn't count as five visitors.
 */

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const KEY = 'ct_sid';

function sessionId(): string {
  try {
    let id = sessionStorage.getItem(KEY);
    if (!id) {
      id = (crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`).slice(0, 64);
      sessionStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    // Private mode / storage disabled — fall back to a per-load id. Views still
    // count; uniques just skew high for that visitor, which is the honest
    // failure direction (better than dropping the view entirely).
    return `nostore-${Math.random().toString(36).slice(2)}`;
  }
}

export default function PageViewTracker() {
  const pathname = usePathname();
  const search = useSearchParams();
  const lastSent = useRef<string>('');

  useEffect(() => {
    if (!pathname) return;
    // React StrictMode double-invokes effects in dev, and a search-param change
    // re-runs this without the page actually changing. Guard on the resolved
    // path so one navigation reports exactly once.
    if (lastSent.current === pathname) return;
    lastSent.current = pathname;

    // Never measure the admin's own tooling — it would drown out real traffic.
    if (pathname.startsWith('/admin')) return;

    const base = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
    const body = JSON.stringify({
      path: pathname,
      title: typeof document !== 'undefined' ? document.title.slice(0, 300) : undefined,
      referrer: typeof document !== 'undefined' && document.referrer ? document.referrer : undefined,
      sessionId: sessionId(),
    });

    // `keepalive` so the report survives the navigation that triggered it.
    // Failure is silent on purpose: analytics must never disturb a visitor.
    fetch(`${base}/analytics/pageview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      credentials: 'include',
      keepalive: true,
    }).catch(() => undefined);
  }, [pathname, search]);

  return null;
}

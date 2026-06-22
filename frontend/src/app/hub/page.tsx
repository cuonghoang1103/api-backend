// Hub — personal bookmark manager. Server component is a thin
// shell: it reads the auth cookie (so SSR can pre-populate folders
// + the "all" view of links) and hands the data off to the client
// component which owns all interactive state.
//
// We deliberately use `force-dynamic` here — Hub is per-user and
// there's no public cache we want to reuse. SSR data is just a
// first-paint optimization; the client refetches on any filter
// change.

import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { getServerApiBaseUrl } from '@/lib/server-api';
import HubClient from './HubClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Hub | CuongThai',
  description:
    'Personal bookmark manager — save, organize, and quickly access ' +
    'your favorite links, articles, and tools.',
  openGraph: {
    title: 'Hub | CuongThai',
    description: 'Personal bookmark manager with smart auto-fill metadata.',
    url: 'https://cuongthai.com/hub',
    type: 'website',
  },
  alternates: { canonical: 'https://cuongthai.com/hub' },
};

async function fetchWithTimeout<T>(
  url: string,
  cookie: string,
  timeoutMs = 4000,
): Promise<T | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: { cookie, accept: 'application/json' },
      signal: controller.signal,
      // `force-dynamic` page + no-store = always fresh, never cached.
      // The `revalidate` option was causing stale data to be served
      // when a different user's session triggered a re-render during
      // the cache window, because Next.js reused the cached response
      // for all concurrent requests regardless of the auth cookie.
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export default async function HubPage() {
  const cookie = headers().get('cookie') ?? '';
  const baseUrl = getServerApiBaseUrl();

  // Parallel SSR fetch — if either endpoint 401s or times out we
  // just hand an empty initial payload to the client. The client
  // will re-mount and try again as soon as the user is on the
  // page, so a missed SSR is harmless.
  const [foldersRes, linksRes] = await Promise.all([
    fetchWithTimeout<{ success: boolean; data: unknown[] }>(
      `${baseUrl}/api/v1/hub/folders?pageSize=100`,
      cookie,
    ),
    fetchWithTimeout<{
      success: boolean;
      data: { items?: unknown[]; total?: number };
      total?: number;
      items?: unknown[];
    }>(`${baseUrl}/api/v1/hub/links?pageSize=50&folderId=all`, cookie),
  ]);

  // Backend wraps listLinks payload in `{ success, data: { items, total, ... } }`
  // (this matches the rest of the API contract — see fix in commit
  // f65ebb8). We unwrap defensively in case the shape ever drifts.
  type MaybeWrapped = { items?: unknown[]; total?: number };
  const extractLinksPayload = (raw: typeof linksRes): {
    items: unknown[];
    total: number;
  } => {
    if (!raw) return { items: [], total: 0 };
    // Axios-like wrapping: { data: { items, total } }
    if (raw.data && typeof raw.data === 'object' && 'items' in raw.data) {
      const wrapped = raw.data as MaybeWrapped;
      return { items: wrapped.items ?? [], total: wrapped.total ?? 0 };
    }
    // Unwrapped: { items, total } directly on the response
    if ('items' in raw) {
      const flat = raw as unknown as MaybeWrapped;
      return { items: flat.items ?? [], total: flat.total ?? 0 };
    }
    return { items: [], total: 0 };
  };

  const initialLinksPayload = extractLinksPayload(linksRes);
  const initialFolders = (() => {
    if (!foldersRes) return [];
    if (Array.isArray(foldersRes.data)) return foldersRes.data;
    if (Array.isArray((foldersRes as { data?: unknown }).data)) {
      return ((foldersRes as { data: unknown[] }).data);
    }
    return [];
  })();

  return (
    <HubClient
      initialFolders={initialFolders as never}
      initialLinks={initialLinksPayload.items as never}
      initialTotal={initialLinksPayload.total}
    />
  );
}

// Public GitHub Repo Hub — the landing route /repos.
//
// The page is split into a thin server component (this file)
// and a fat client component (ReposFeedClient.tsx). The server
// component does a one-time SSR fetch so the first paint shows
// real cards (better LCP, no flash of empty grid). The client
// component then takes over for filters / pagination / search,
// which all live in URL state.
//
// The canvas backdrop is mounted at the layout level (not
// here) so it can persist across navigation within the page.

import ReposFeedClient from './ReposFeedClient';
import type { GithubRepoListResponse } from '@/lib/api';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { getServerApiBaseUrl } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'GitHub Repo Hub',
  description:
    'A curated hub of GitHub repositories with reviews, lessons learned, ' +
    'and engineering write-ups for every project.',
  openGraph: {
    title: 'GitHub Repo Hub | CuongThai',
    description:
      'A curated hub of GitHub repositories with reviews and engineering write-ups.',
    url: 'https://cuongthai.com/repos',
    type: 'website',
  },
  alternates: {
    canonical: 'https://cuongthai.com/repos',
  },
};

// Cache SSR data for 60 seconds. Without this, every cold page
// view hits the backend + database. With it, the second view
// inside the 60s window is served from memory (Vercel/Next
// shared cache) and TTFB drops from 8s to <100ms.
//
// We use `force-dynamic` ABOVE so that user-specific
// `?includeDrafts=1` views always re-render — but the fetch
// below still has its own per-request cache. That combination
// means: cookie-bound requests always run, but anonymous
// visitors get the 60s cache for free.
const REPOS_CACHE_TTL_SECONDS = 60;

// Shape returned by /api/v1/repos. Note: this endpoint is the
// odd one out — it returns the list payload at the TOP level
// (`{success, items, total, ...}`) instead of wrapping it in
// a `data` field. /api/v1/repos/tags and /api/v1/repos/languages
// DO use the `{success, data: [...]}` envelope. We type the
// two shapes separately so callers can't mix them up.
type RepoListPayload = GithubRepoListResponse & { success: boolean }

// `/repos/tags` returns `{success, data: [{id, name, slug}]}`.
// `/repos/languages` returns `{success, data: [{name, count}]}`.
type Envelope<T> = { success: boolean; data: T[] }

/**
 * Bounded parallel fetch. Each fetch has its own 4s timeout;
 * the overall `Promise.all` resolves in <=4s. We do NOT want
 * one slow endpoint (e.g. /languages) to block the others, so
 * each one races independently and we tolerate failures
 * individually — a single endpoint being down shouldn't kill
 * SSR data for the page.
 */
async function fetchWithTimeout<T>(
  url: string,
  cookie: string,
  timeoutMs = 4000
): Promise<T | null> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, {
      headers: { cookie, accept: 'application/json' },
      signal: controller.signal,
      // `next.revalidate` is the canonical Next 14 way to scope
      // a fetch's cache. 60s here matches REPOS_CACHE_TTL_SECONDS.
      next: { revalidate: REPOS_CACHE_TTL_SECONDS },
    })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

export default async function ReposPage() {
  // Server-side initial load. We pass through any auth cookie
  // so an admin viewing drafts on /repos?includeDrafts=1
  // works as expected.
  const headerList = headers();
  const cookie = headerList.get('cookie') ?? '';

  // Use the server-side API base. This is `http://backend:3001`
  // in production (internal Docker network, ~50ms latency)
  // instead of the public URL (3-5s cold-start latency because
  // the request goes out to the internet and back through nginx).
  // See lib/server-api.ts for why this is the right call.
  const baseUrl = getServerApiBaseUrl();

  let initialData: GithubRepoListResponse | null = null;
  let initialTags: { id: number; name: string; slug: string }[] = [];
  let initialLanguages: { name: string; count: number }[] = [];

  try {
    // Parallel fetch with per-endpoint timeouts. We catch each
    // individually so a single failed endpoint doesn't void the
    // whole SSR pass — the client component will retry the
    // missing one on mount.
    //
    // Note the two different response shapes:
    //   - /repos returns the list payload at top level
    //   - /repos/tags and /repos/languages wrap their array in `data`
    const [list, tags, langs] = await Promise.all([
      fetchWithTimeout<RepoListPayload>(
        `${baseUrl}/api/v1/repos?pageSize=12`,
        cookie
      ),
      fetchWithTimeout<Envelope<{ id: number; name: string; slug: string }>>(
        `${baseUrl}/api/v1/repos/tags`,
        cookie
      ),
      fetchWithTimeout<Envelope<{ name: string; count: number }>>(
        `${baseUrl}/api/v1/repos/languages`,
        cookie
      ),
    ])
    initialData = list
      ? {
          items: list.items,
          total: list.total,
          page: list.page,
          pageSize: list.pageSize,
          totalPages: list.totalPages,
          sort: list.sort,
        }
      : null
    initialTags = tags?.data ?? []
    initialLanguages = langs?.data ?? []
  } catch {
    // Swallow — the client component will retry on mount.
  }

  return (
    <ReposFeedClient
      initialData={initialData}
      initialTags={initialTags}
      initialLanguages={initialLanguages}
    />
  );
}

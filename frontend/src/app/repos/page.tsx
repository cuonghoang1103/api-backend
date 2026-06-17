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
import { githubApi } from '@/lib/api';
import type { Metadata } from 'next';
import { headers } from 'next/headers';

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

// Tell crawlers (and Next.js) this page is user-facing and
// should be rendered on demand. The Hub list changes too
// often for ISR to be useful.
export const revalidate = 0;

export default async function ReposPage() {
  // Server-side initial load. We pass through any auth cookie
  // so an admin viewing drafts on /repos?includeDrafts=1
  // works as expected.
  const headerList = headers();
  const cookie = headerList.get('cookie') ?? '';

  // Use the absolute API base on the server. We can't go
  // through the `/api/v1` rewrite from a server component
  // because the rewrite only runs on Next.js request handlers,
  // not on `fetch` calls.
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  let initialData: Awaited<ReturnType<typeof githubApi.list>>['data'] | null = null;
  let initialTags: { id: number; name: string; slug: string }[] = [];
  let initialLanguages: { name: string; count: number }[] = [];

  try {
    const [list, tags, langs] = await Promise.all([
      fetch(`${baseUrl}/api/v1/repos?pageSize=12`, {
        headers: { cookie, accept: 'application/json' },
        cache: 'no-store',
      }).then((r) => (r.ok ? r.json() : null)),
      fetch(`${baseUrl}/api/v1/repos/tags`, { cache: 'no-store' }).then((r) => (r.ok ? r.json() : null)),
      fetch(`${baseUrl}/api/v1/repos/languages`, { cache: 'no-store' }).then((r) => (r.ok ? r.json() : null)),
    ]);
    initialData = list;
    initialTags = (tags?.data as { id: number; name: string; slug: string }[]) ?? [];
    initialLanguages = (langs?.data as { name: string; count: number }[]) ?? [];
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

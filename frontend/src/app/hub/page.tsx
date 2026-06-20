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

const HUB_CACHE_TTL_SECONDS = 30;

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
      next: { revalidate: HUB_CACHE_TTL_SECONDS },
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
      data: unknown[];
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
    }>(`${baseUrl}/api/v1/hub/links?pageSize=50&folderId=all`, cookie),
  ]);

  return (
    <HubClient
      initialFolders={(foldersRes?.data ?? []) as never}
      initialLinks={(linksRes?.data ?? []) as never}
      initialTotal={linksRes?.total ?? 0}
    />
  );
}

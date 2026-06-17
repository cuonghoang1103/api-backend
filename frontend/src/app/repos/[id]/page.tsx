// Public GitHub Repo Hub — single repo detail page /repos/[id].
//
// Server component that fetches the repo + the related/recent
// repos on the server so the first paint is real content (good
// LCP + SEO for shareable links). The hand-off to the client
// component is minimal: it only handles the "back to feed" UI
// and the share/copy button.

import RepoDetailClient from './RepoDetailClient';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { getServerApiBaseUrl } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: { id: string };
}

// 60s cache for the detail page. The repo data is read-only and
// doesn't change often (admin edits through the CMS, not user
// actions), so a 60s revalidation window keeps the data fresh
// enough while cutting cold-start latency in half.
const REPO_CACHE_TTL_SECONDS = 60;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Lightweight fetch just for metadata — we still hit the API
  // because the URL is an opaque UUID, not a slug, so we can't
  // pre-bake titles. If the repo doesn't exist we still return
  // a sensible default so Next.js doesn't crash.
  const baseUrl = getServerApiBaseUrl();
  const cookie = headers().get('cookie') ?? '';
  try {
    const res = await fetch(`${baseUrl}/api/v1/repos/${params.id}`, {
      headers: { cookie, accept: 'application/json' },
      next: { revalidate: REPO_CACHE_TTL_SECONDS },
    });
    if (!res.ok) {
      return { title: 'Repo not found | CuongThai' };
    }
    const json = await res.json();
    if (!json.success || !json.data) {
      return { title: 'Repo not found | CuongThai' };
    }
    const repo = json.data;
    const description = repo.description
      || repo.myReview?.replace(/[#*`>\-]+/g, '').trim().slice(0, 200)
      || `Repository ${repo.repoName} by ${repo.owner} on GitHub. Reviewed and curated on CuongThai.`;
    return {
      title: `${repo.repoName} | GitHub Repo Hub | CuongThai`,
      description,
      openGraph: {
        title: `${repo.repoName} — GitHub Repo Hub`,
        description,
        type: 'article',
        url: `https://cuongthai.com/repos/${params.id}`,
      },
      twitter: {
        card: 'summary',
        title: repo.repoName,
        description,
      },
    };
  } catch {
    return { title: 'Repo | CuongThai' };
  }
}

export default async function RepoDetailPage({ params }: PageProps) {
  const headerList = headers();
  const cookie = headerList.get('cookie') ?? '';
  // Use the server-side API base (internal Docker network).
  // See lib/server-api.ts for why this matters for TTFB.
  const baseUrl = getServerApiBaseUrl();

  let repo: import('@/lib/api').GithubRepo | null = null;
  let related: import('@/lib/api').GithubRepo[] = [];

  try {
    const [detailRes, listRes] = await Promise.all([
      fetch(`${baseUrl}/api/v1/repos/${params.id}`, {
        headers: { cookie, accept: 'application/json' },
        next: { revalidate: REPO_CACHE_TTL_SECONDS },
      }),
      fetch(`${baseUrl}/api/v1/repos?pageSize=6`, {
        headers: { cookie, accept: 'application/json' },
        next: { revalidate: REPO_CACHE_TTL_SECONDS },
      }),
    ]);

    if (detailRes.ok) {
      const detailJson = await detailRes.json();
      if (detailJson.success && detailJson.data) {
        repo = detailJson.data;
      }
    }
    if (listRes.ok) {
      const listJson = await listRes.json();
      if (listJson.success && Array.isArray(listJson.items)) {
        // Drop the current repo from the related list.
        related = listJson.items.filter((r: import('@/lib/api').GithubRepo) => r.id !== params.id).slice(0, 4);
      }
    }
  } catch {
    // Swallow — client component shows an error state and offers
    // a retry button.
  }

  if (!repo) {
    notFound();
  }

  return <RepoDetailClient repo={repo!} related={related} />;
}

// Public GitHub Repo Hub — single repo detail page /repos/[id].
//
// Server component that fetches the repo + the related/recent
// repos on the server so the first paint is real content (good
// LCP + SEO for shareable links). The hand-off to the client
// component is minimal: it only handles the "back to feed" UI
// and the share/copy button.

import RepoDetailClient from './RepoDetailClient';
import { githubApi } from '@/lib/api';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Lightweight fetch just for metadata — we still hit the API
  // because the URL is an opaque UUID, not a slug, so we can't
  // pre-bake titles. If the repo doesn't exist we still return
  // a sensible default so Next.js doesn't crash.
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const cookie = headers().get('cookie') ?? '';
  try {
    const res = await fetch(`${baseUrl}/api/v1/repos/${params.id}`, {
      headers: { cookie, accept: 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) {
      return { title: 'Repo not found | CuongHoangDev' };
    }
    const json = await res.json();
    if (!json.success || !json.data) {
      return { title: 'Repo not found | CuongHoangDev' };
    }
    const repo = json.data;
    const description = repo.description
      || repo.myReview?.replace(/[#*`>\-]+/g, '').trim().slice(0, 200)
      || `Repository ${repo.repoName} by ${repo.owner} on GitHub. Reviewed and curated on CuongHoangDev.`;
    return {
      title: `${repo.repoName} | GitHub Repo Hub | CuongHoangDev`,
      description,
      openGraph: {
        title: `${repo.repoName} — GitHub Repo Hub`,
        description,
        type: 'article',
        url: `https://cuonghoang.xyz/repos/${params.id}`,
      },
      twitter: {
        card: 'summary',
        title: repo.repoName,
        description,
      },
    };
  } catch {
    return { title: 'Repo | CuongHoangDev' };
  }
}

export default async function RepoDetailPage({ params }: PageProps) {
  const headerList = headers();
  const cookie = headerList.get('cookie') ?? '';
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  let repo: import('@/lib/api').GithubRepo | null = null;
  let related: import('@/lib/api').GithubRepo[] = [];

  try {
    const [detailRes, listRes] = await Promise.all([
      fetch(`${baseUrl}/api/v1/repos/${params.id}`, {
        headers: { cookie, accept: 'application/json' },
        cache: 'no-store',
      }),
      fetch(`${baseUrl}/api/v1/repos?pageSize=6`, {
        headers: { cookie, accept: 'application/json' },
        cache: 'no-store',
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

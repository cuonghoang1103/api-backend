import type { Metadata } from 'next';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import { getServerApiBaseUrl } from '@/lib/server-api';
import type { Snippet } from '@/types/exp-hub';
import { ChiTietSnippet } from './ChiTietSnippet';

/**
 * EXP_Hub — snippet/project detail page (SSR).
 *
 * The main /exp-hub view is a client app that ships an empty shell to
 * crawlers. This route server-renders one entry (by slug) into the initial
 * HTML so each snippet/project has a shareable permalink with real content,
 * a canonical URL, an OpenGraph card, JSON-LD, and server-highlighted code.
 */
export const dynamic = 'force-dynamic';

const SITE_URL = 'https://cuongthai.com';

interface PageProps { params: { slug: string }; searchParams?: { ref?: string; reflabel?: string } }

const getSnippet = cache(async (slug: string): Promise<Snippet | null> => {
  try {
    const res = await fetch(
      `${getServerApiBaseUrl()}/api/v1/snippets/slug/${encodeURIComponent(slug)}`,
      { headers: { accept: 'application/json' }, cache: 'no-store' },
    );
    if (!res.ok) return null;
    const json = await res.json();
    return (json?.data as Snippet) ?? null;
  } catch {
    return null;
  }
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const s = await getSnippet(params.slug);
  if (!s) return { title: 'EXP_Hub | CuongThai' };
  const title = `${s.title} | EXP_Hub | CuongThai`;
  const description = (s.description || `${s.title} — lệnh, cài đặt & ghi chú tham khảo.`).slice(0, 200);
  const url = `${SITE_URL}/exp-hub/${params.slug}`;
  return {
    title,
    description,
    keywords: s.tags?.length ? s.tags.map((t) => t.name) : undefined,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'article' },
    twitter: { card: 'summary', title, description },
  };
}

export default async function ExpHubSnippetPage({ params, searchParams }: PageProps) {
  // "Back to course" — set when an Academy/Courses lesson links here with
  // ?ref=<internal path>&reflabel=<name>. Only internal paths are honoured.
  const s = await getSnippet(params.slug);
  if (!s) notFound();
  return (
    <ChiTietSnippet s={s} slug={params.slug}
      backRef={searchParams?.ref || ''} backLabel={searchParams?.reflabel || 'khóa học'} />
  );
}

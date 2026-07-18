import type { Metadata } from 'next';
import Link from 'next/link';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { getServerApiBaseUrl } from '@/lib/server-api';
import type { GameDto } from '@/lib/api';
import GamePlayClient from './GamePlayClient';

/**
 * /games/[slug] — game detail + play page.
 *
 * Server-rendered from the DB (replaces the old static GAMES_DATA lookup +
 * generateStaticParams), so each game gets real per-game SEO: title /
 * description / OG / canonical + VideoGame JSON-LD. The playable component is
 * client-only and code-split through the registry, so this page's HTML stays
 * crawlable and ships no game code until the player hits Start.
 *
 * DRAFT games 404 for everyone except admins — the API makes that call, so we
 * forward the cookie for it to see the session.
 */
export const dynamic = 'force-dynamic';

const SITE_URL = 'https://cuongthai.com';

interface PageProps { params: { slug: string } }

const getGame = cache(async (slug: string, cookie: string): Promise<GameDto | null> => {
  try {
    const res = await fetch(
      `${getServerApiBaseUrl()}/api/v1/games/by-slug/${encodeURIComponent(slug)}`,
      { headers: { accept: 'application/json', cookie }, cache: 'no-store' },
    );
    if (!res.ok) return null;
    const json = await res.json();
    return (json?.data as GameDto) ?? null;
  } catch {
    return null;
  }
});

async function getRelated(id: number): Promise<GameDto[]> {
  try {
    const res = await fetch(`${getServerApiBaseUrl()}/api/v1/games/${id}/related`, {
      headers: { accept: 'application/json' },
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json?.data) ? (json.data as GameDto[]) : [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const game = await getGame(params.slug, headers().get('cookie') ?? '');
  if (!game) return { title: 'Game | Playground | CuongThai' };

  const url = `${SITE_URL}/games/${params.slug}`;
  const description = (game.description || '').slice(0, 200);
  const image = game.coverImage || undefined;

  return {
    title: `${game.title} — Playground | CuongThai`,
    description,
    keywords: game.tags?.length ? game.tags : undefined,
    alternates: { canonical: url },
    openGraph: {
      title: game.title,
      description,
      url,
      type: 'website',
      images: image ? [image] : ['/opengraph-image'],
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: game.title,
      description,
      images: image ? [image] : undefined,
    },
    // Drafts are admin-previewable but must never be indexed.
    robots: game.status === 'DRAFT' ? { index: false, follow: false } : undefined,
  };
}

export default async function GameDetailPage({ params }: PageProps) {
  const game = await getGame(params.slug, headers().get('cookie') ?? '');
  if (!game) notFound();

  const related = await getRelated(game.id);
  const url = `${SITE_URL}/games/${params.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.title,
    description: game.description,
    url,
    image: game.coverImage || undefined,
    applicationCategory: 'Game',
    genre: game.category?.name,
    operatingSystem: 'Web browser',
    gamePlatform: 'Web browser',
    playMode: 'SinglePlayer',
    datePublished: game.createdAt,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };

  return (
    <div className="min-h-screen pt-24 pb-20" style={{ background: '#020110' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(55% 45% at 12% -5%, rgba(139,92,246,0.18), transparent 60%),' +
            'radial-gradient(50% 40% at 92% 8%, rgba(34,211,238,0.12), transparent 60%),' +
            'radial-gradient(70% 55% at 50% 118%, rgba(217,70,239,0.10), transparent 60%)',
        }}
      />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="mb-5 text-sm text-text-muted flex items-center gap-1.5">
          <Link href="/games" className="hover:text-neon-violet transition-colors">Playground</Link>
          <span>/</span>
          <span className="text-text-secondary">{game.category?.name}</span>
        </nav>

        <GamePlayClient game={game} related={related} />
      </div>
    </div>
  );
}

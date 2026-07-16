import type { Metadata } from 'next';
import { getServerApiBaseUrl } from '@/lib/server-api';
import type { GameDto, GameCategoryDto, GameStats, GameLeaderEntry } from '@/lib/api';
import GamesPortalClient from './GamesPortalClient';

/**
 * /games — the Playground portal.
 *
 * Server component: fetches the catalogue, categories, stats and the
 * leaderboard teaser from the API at request time, then hands them to a client
 * component that owns filtering/search/view-toggle (client-side over the
 * already-fetched list, URL-synced so filters are shareable).
 *
 * Replaces the old static GAMES_DATA array — the catalogue is now admin-managed
 * in /admin/games.
 *
 * `force-dynamic` keeps these fetches out of `npm run build` (the backend isn't
 * running then). Every fetch is fail-open: a down API renders an empty portal
 * rather than a 500.
 */
export const dynamic = 'force-dynamic';

const SITE_URL = 'https://cuongthai.com';

export const metadata: Metadata = {
  title: 'Playground — Games',
  description:
    'Original browser games built from scratch with HTML5 Canvas, React and TypeScript. Play free, no install.',
  alternates: { canonical: `${SITE_URL}/games` },
  openGraph: {
    title: 'Playground — Games | CuongThai',
    description: 'Original browser games built with Canvas, React & TypeScript. Play free.',
    url: `${SITE_URL}/games`,
    type: 'website',
    images: ['/opengraph-image'],
  },
};

async function fetchJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${getServerApiBaseUrl()}/api/v1${path}`, {
      headers: { accept: 'application/json' },
      cache: 'no-store',
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return fallback;
    const json = await res.json();
    return (json?.data as T) ?? fallback;
  } catch {
    return fallback; // fail-open — the portal still renders
  }
}

export default async function GamesPage() {
  const [games, categories, stats, leaders] = await Promise.all([
    fetchJson<GameDto[]>('/games', []),
    fetchJson<GameCategoryDto[]>('/games/categories', []),
    fetchJson<GameStats>('/games/stats', { games: 0, categories: 0, totalPlays: 0 }),
    fetchJson<GameLeaderEntry[]>('/games/leaderboard?limit=5', []),
  ]);

  // JSON-LD: tells Google this is a game hub, not a generic list.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Playground — Games',
    url: `${SITE_URL}/games`,
    numberOfItems: games.length,
    hasPart: games.slice(0, 20).map((g) => ({
      '@type': 'VideoGame',
      name: g.title,
      url: `${SITE_URL}/games/${g.slug}`,
      applicationCategory: 'Game',
      operatingSystem: 'Web browser',
      genre: g.category?.name,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <GamesPortalClient games={games} categories={categories} stats={stats} leaders={leaders} />
    </>
  );
}

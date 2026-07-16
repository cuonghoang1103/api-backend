import type { Metadata } from 'next';
import Link from 'next/link';
import { getServerApiBaseUrl } from '@/lib/server-api';
import type { GameDto } from '@/lib/api';
import LeaderboardClient from './LeaderboardClient';

/**
 * /games/leaderboard — top 20 per game, one tab per scored game.
 *
 * The game list is server-fetched (so the tabs render immediately and the page
 * is crawlable); each tab's scores load client-side on demand rather than
 * fetching every game's board up front.
 */
export const dynamic = 'force-dynamic';

const SITE_URL = 'https://cuongthai.com';

export const metadata: Metadata = {
  title: 'Leaderboard — Playground | CuongThai',
  description: 'Top scores across every game in the Playground.',
  alternates: { canonical: `${SITE_URL}/games/leaderboard` },
};

async function getGames(): Promise<GameDto[]> {
  try {
    const res = await fetch(`${getServerApiBaseUrl()}/api/v1/games`, {
      headers: { accept: 'application/json' },
      cache: 'no-store',
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json?.data) ? (json.data as GameDto[]) : [];
  } catch {
    return [];
  }
}

export default async function LeaderboardPage() {
  const games = (await getGames()).filter((g) => g.status === 'PUBLISHED');

  return (
    <div className="min-h-screen pt-24 pb-20" style={{ background: '#020110' }}>
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="mb-5 text-sm text-text-muted flex items-center gap-1.5">
          <Link href="/games" className="hover:text-neon-violet transition-colors">Playground</Link>
          <span>/</span>
          <span className="text-text-secondary">Leaderboard</span>
        </nav>
        <LeaderboardClient games={games} />
      </div>
    </div>
  );
}

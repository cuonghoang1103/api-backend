'use client';

/**
 * Leaderboard tabs. Only games the registry marks `scored` get a tab — Tic Tac
 * Toe has no score ladder, so a board for it would just be a wall of zeroes.
 *
 * Boards load per tab (not all at once) and the signed-in player's own entries
 * are highlighted.
 */

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Trophy, Loader2, Medal, Gamepad2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuthStore } from '@/store/authStore';
import { gamesApi, type GameDto, type GameLeaderEntry } from '@/lib/api';
import { getRegistryEntry } from '@/components/games/registry';

export default function LeaderboardClient({ games }: { games: GameDto[] }) {
  const { t, locale } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const myId = user?.id ? Number(user.id) : null;

  const L = (en: string | null | undefined, vi: string | null | undefined) =>
    ((locale === 'vi' ? vi || en : en || vi) ?? '');

  // A game only has a meaningful board if its component reports scores.
  const scored = games.filter((g) => getRegistryEntry(g.componentKey)?.scored);

  const [active, setActive] = useState<number | null>(scored[0]?.id ?? null);
  const [rows, setRows] = useState<GameLeaderEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback((id: number) => {
    setLoading(true);
    gamesApi.gameLeaderboard(id, 20)
      .then((r) => setRows(r.data.data))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { if (active) load(active); }, [active, load]);

  if (scored.length === 0) {
    return (
      <div className="rounded-2xl border border-darkborder bg-darkcard/60 p-12 text-center">
        <Gamepad2 className="w-8 h-8 text-text-muted mx-auto mb-3" />
        <p className="text-sm text-text-secondary">{t('games.empty')}</p>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text-primary tracking-tight flex items-center gap-2.5">
        <Trophy className="w-7 h-7 text-neon-orange" /> {t('games.leaderboard')}
      </h1>
      <p className="mt-2 text-sm text-text-secondary">{t('games.topScores')} — top 20.</p>

      {/* Tabs */}
      <div className="mt-6 flex gap-1.5 overflow-x-auto pb-1 scrollbar-none" role="tablist">
        {scored.map((g) => (
          <button
            key={g.id}
            role="tab"
            aria-selected={active === g.id}
            onClick={() => setActive(g.id)}
            className={[
              'shrink-0 px-3.5 py-2 rounded-xl text-xs font-medium border transition-colors whitespace-nowrap',
              active === g.id
                ? 'bg-neon-violet/20 text-neon-violet border-neon-violet/30'
                : 'bg-white/[0.03] text-text-secondary border-darkborder hover:text-text-primary',
            ].join(' ')}
          >
            {L(g.title, g.titleVi)}
          </button>
        ))}
      </div>

      {/* Board */}
      <div className="mt-4 rounded-2xl border border-darkborder bg-darkcard/60 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center"><Loader2 className="w-5 h-5 mx-auto animate-spin text-neon-violet" /></div>
        ) : rows.length === 0 ? (
          <p className="py-16 text-center text-sm text-text-muted">
            {locale === 'vi' ? 'Chưa có ai ghi điểm. Bạn có thể là người đầu tiên!' : 'No scores yet — be the first!'}
          </p>
        ) : (
          <ol>
            {rows.map((e) => {
              const mine = myId != null && e.userId === myId;
              return (
                <li
                  key={e.id}
                  className={[
                    'flex items-center gap-3 px-4 py-3 border-b border-darkborder/60 last:border-0',
                    mine ? 'bg-neon-violet/10' : '',
                  ].join(' ')}
                >
                  <span className={[
                    'w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 tabular-nums',
                    e.rank === 1 ? 'bg-neon-orange/20 text-neon-orange'
                      : e.rank === 2 ? 'bg-white/10 text-text-secondary'
                      : e.rank === 3 ? 'bg-amber-700/20 text-amber-500'
                      : 'text-text-muted',
                  ].join(' ')}>
                    {e.rank <= 3 ? <Medal className="w-3.5 h-3.5" /> : e.rank}
                  </span>

                  {e.player?.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={e.player.avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
                  ) : (
                    <span className="w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center text-[10px] text-text-muted shrink-0">
                      {(e.player?.name ?? '?').slice(0, 1).toUpperCase()}
                    </span>
                  )}

                  <span className={['text-sm truncate', mine ? 'text-neon-violet font-semibold' : 'text-text-primary'].join(' ')}>
                    {e.player?.name ?? t('games.anonymous')}
                    {mine && <span className="ml-1.5 text-[10px] text-text-muted">({locale === 'vi' ? 'bạn' : 'you'})</span>}
                  </span>

                  <span className="ml-auto tabular-nums font-heading font-bold text-neon-violet shrink-0">
                    {e.score.toLocaleString()}
                  </span>
                </li>
              );
            })}
          </ol>
        )}
      </div>

      {active && (
        <div className="mt-4 text-center">
          <Link
            href={`/games/${scored.find((g) => g.id === active)?.slug ?? ''}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-darkborder text-sm text-text-secondary hover:text-text-primary hover:border-neon-violet/30 transition-all"
          >
            {t('games.playNow')} →
          </Link>
        </div>
      )}
    </>
  );
}

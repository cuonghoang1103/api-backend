'use client';

/**
 * Game detail — the interactive half.
 *
 * Responsibilities that deliberately live HERE and not in GameShell or the
 * game itself:
 *   - resolving componentKey → component via the registry (code-split)
 *   - counting a play once per session per game (sessionStorage guard)
 *   - submitting the score and rendering this game's leaderboard
 *
 * IFRAME games (standalone HTML in /public) render in a sandboxed frame and
 * don't participate in scoring — they have no way to call onScore.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Clock, Trophy, ChevronDown, Gamepad2, Medal, Loader2, Lock,
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { gamesApi, type GameDto, type GameLeaderEntry, type GameDifficulty } from '@/lib/api';
import { getRegistryEntry } from '@/components/games/registry';
import GameShell from '@/components/games/shared/GameShell';

export default function GamePlayClient({ game, related }: { game: GameDto; related: GameDto[] }) {
  const { t, locale } = useTranslation();
  const L = (en: string | null | undefined, vi: string | null | undefined) =>
    ((locale === 'vi' ? vi || en : en || vi) ?? '');

  const [leaders, setLeaders] = useState<GameLeaderEntry[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);

  const entry = useMemo(() => getRegistryEntry(game.componentKey), [game.componentKey]);
  // Resolve the lazy component once — calling load() on every render would
  // create a new dynamic component each time and remount the game.
  const GameComponent = useMemo(() => entry?.load() ?? null, [entry]);

  const playable = game.status === 'PUBLISHED';

  // Count one play per session per game. sessionStorage keeps a refresh from
  // inflating the counter; the server's rate limiter is the real backstop.
  useEffect(() => {
    if (!playable) return;
    const key = `game:played:${game.id}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
    } catch {
      return; // storage blocked → skip counting rather than double-count
    }
    gamesApi.recordPlay(game.id).catch(() => {});
  }, [game.id, playable]);

  const loadLeaders = useCallback(() => {
    gamesApi.gameLeaderboard(game.id, 10)
      .then((r) => setLeaders(r.data.data))
      .catch(() => {});
  }, [game.id]);

  useEffect(() => { if (playable) loadLeaders(); }, [playable, loadLeaders]);

  const onEnd = useCallback(async (score: number, durationSec?: number) => {
    if (!entry?.scored) return; // unscored game (e.g. Tic Tac Toe)
    setSubmitting(true);
    try {
      await gamesApi.submitScore(game.id, score, durationSec);
      loadLeaders(); // reflect the new entry immediately
    } catch {
      /* a failed submit must never break the end screen */
    } finally {
      setSubmitting(false);
    }
  }, [entry?.scored, game.id, loadLeaders]);

  return (
    <>
      {/* ── Title + meta ── */}
      <header className="mb-5">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {game.category && (
            <span
              className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium border"
              style={{
                color: game.category.color ?? undefined,
                borderColor: game.category.color ? `${game.category.color}40` : undefined,
                background: game.category.color ? `${game.category.color}1f` : undefined,
              }}
            >
              {L(game.category.name, game.category.nameVi)}
            </span>
          )}
          <DifficultyPill d={game.difficulty} t={t} />
          {game.estimatedTime && (
            <span className="inline-flex items-center gap-1 text-[11px] text-text-muted">
              <Clock className="w-3 h-3" /> {game.estimatedTime}
            </span>
          )}
          <span className="text-[11px] text-text-muted">· {game.playCount} {t('games.plays')}</span>
          {game.bestScore != null && game.bestScore > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] text-neon-orange">
              <Trophy className="w-3 h-3" /> {t('games.bestScore')}: {game.bestScore}
            </span>
          )}
        </div>
        <h1 className="bg-gradient-to-br from-white via-neon-violet to-neon-cyan bg-clip-text text-3xl font-heading font-bold tracking-tight text-transparent sm:text-4xl">
          {L(game.title, game.titleVi)}
        </h1>
        <p className="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
          {L(game.description, game.descriptionVi)}
        </p>
      </header>

      {/* ── Stage ── */}
      <div className="mx-auto" style={{ maxWidth: 900 }}>
        {!playable ? (
          <ComingSoon label={t('games.comingSoon')} />
        ) : game.kind === 'IFRAME' && game.iframeSrc ? (
          // Sandboxed: the HTML game gets scripts + same-origin (it needs its
          // own assets) but nothing else — no top-navigation, no popups.
          <div className="overflow-hidden rounded-2xl border border-darkborder bg-[#0a0a14] shadow-[0_0_0_1px_rgba(139,92,246,0.10),0_28px_80px_-32px_rgba(139,92,246,0.55)]">
            <iframe
              src={game.iframeSrc}
              title={L(game.title, game.titleVi)}
              className="w-full"
              style={{ height: 560, border: 0 }}
              sandbox="allow-scripts allow-same-origin allow-forms"
              allow="autoplay; fullscreen"
              loading="lazy"
            />
          </div>
        ) : GameComponent && entry ? (
          <GameShell
            title={L(game.title, game.titleVi)}
            howTo={L(game.controls, game.controlsVi)}
            locale={locale === 'vi' ? 'vi' : 'en'}
            scored={entry.scored}
            onEnd={onEnd}
            render={(props) => <GameComponent {...props} />}
            extra={
              <EndExtra
                submitting={submitting}
                leaders={leaders}
                labels={{ top: t('games.topScores'), anon: t('games.anonymous') }}
              />
            }
            labels={{
              start: t('games.playNow'),
              howToPlay: t('games.howToPlay'),
              paused: locale === 'vi' ? 'Tạm dừng' : 'Paused',
              resume: locale === 'vi' ? 'Tiếp tục' : 'Resume',
              yourScore: t('games.yourScore'),
              best: t('games.bestScore'),
              replay: t('games.replay'),
              fullscreen: t('games.fullscreen'),
              exit: locale === 'vi' ? 'Thoát' : 'Exit',
            }}
          />
        ) : (
          // Published but its component isn't in the registry yet — say so
          // instead of rendering a blank box.
          <MissingComponent componentKey={game.componentKey} />
        )}
      </div>

      {/* ── How to play (collapsible) ── */}
      {L(game.controls, game.controlsVi) && (
        <div className="mx-auto mt-5" style={{ maxWidth: 900 }}>
          <button
            onClick={() => setShowHowTo((v) => !v)}
            aria-expanded={showHowTo}
            className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-darkcard/60 border border-darkborder text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <span className="font-medium">{t('games.howToPlay')}</span>
            <ChevronDown className={['w-4 h-4 transition-transform', showHowTo ? 'rotate-180' : ''].join(' ')} />
          </button>
          {showHowTo && (
            <div className="px-4 py-3 text-sm text-text-secondary leading-relaxed whitespace-pre-wrap border-x border-b border-darkborder rounded-b-xl bg-darkcard/30">
              {L(game.controls, game.controlsVi)}
              {L(game.longDescription, game.longDescription) && (
                <p className="mt-3 text-text-muted whitespace-pre-wrap">{game.longDescription}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Screenshots ── */}
      {game.screenshots && game.screenshots.length > 0 && (
        <section className="mt-10">
          <h2 className="text-sm font-heading font-semibold text-text-primary mb-3">{t('games.screenshots')}</h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {game.screenshots.map((s, i) => (
              <li key={s + i} className="rounded-xl overflow-hidden border border-darkborder aspect-video bg-darkbg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s} alt={`${game.title} screenshot ${i + 1}`} loading="lazy" className="w-full h-full object-cover" />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Leaderboard ── */}
      {playable && entry?.scored && leaders.length > 0 && (
        <section className="mt-10 rounded-2xl border border-darkborder bg-darkcard/60 p-5 shadow-[0_22px_64px_-34px_rgba(139,92,246,0.5)]">
          <h2 className="text-sm font-heading font-semibold text-text-primary flex items-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-neon-orange" /> {t('games.topScores')}
          </h2>
          <LeaderList leaders={leaders} anon={t('games.anonymous')} />
        </section>
      )}

      {/* ── Related ── */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-heading font-semibold text-text-primary mb-4">{t('games.related')}</h2>
          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((r) => (
              <li key={r.id}>
                <Link href={`/games/${r.slug}`} className="group block overflow-hidden rounded-xl border border-darkborder bg-darkcard/60 shadow-[0_14px_40px_-22px_rgba(0,0,0,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:border-neon-violet/40 hover:shadow-[0_18px_44px_-20px_rgba(139,92,246,0.4)]">
                  <div className="aspect-video bg-darkbg overflow-hidden">
                    {r.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.coverImage} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Gamepad2 className="w-6 h-6 text-text-muted" /></div>
                    )}
                  </div>
                  <p className="p-3 text-xs font-semibold text-text-primary truncate group-hover:text-neon-violet transition-colors">
                    {L(r.title, r.titleVi)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

// ─── bits ──────────────────────────────────────────────────────────

function EndExtra({ submitting, leaders, labels }: {
  submitting: boolean; leaders: GameLeaderEntry[]; labels: { top: string; anon: string };
}) {
  return (
    <div className="space-y-3">
      {submitting && (
        <p className="text-[11px] text-text-muted inline-flex items-center gap-1.5">
          <Loader2 className="w-3 h-3 animate-spin" /> …
        </p>
      )}
      {leaders.length > 0 && (
        <div className="text-left rounded-xl bg-black/30 border border-darkborder p-3">
          <p className="text-[11px] uppercase tracking-wider text-text-muted mb-2">{labels.top}</p>
          <LeaderList leaders={leaders.slice(0, 5)} anon={labels.anon} compact />
        </div>
      )}
    </div>
  );
}

function LeaderList({ leaders, anon, compact }: { leaders: GameLeaderEntry[]; anon: string; compact?: boolean }) {
  return (
    <ol className={compact ? 'space-y-1' : 'space-y-2'}>
      {leaders.map((e) => (
        <li key={e.id} className="flex items-center gap-2.5 text-sm">
          <span className={[
            'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0',
            e.rank === 1 ? 'bg-neon-orange/20 text-neon-orange'
              : e.rank === 2 ? 'bg-white/10 text-text-secondary'
              : e.rank === 3 ? 'bg-amber-700/20 text-amber-500'
              : 'text-text-muted',
          ].join(' ')}>
            {e.rank <= 3 ? <Medal className="w-2.5 h-2.5" /> : e.rank}
          </span>
          <span className="text-text-secondary truncate">{e.player?.name ?? anon}</span>
          <span className="ml-auto tabular-nums font-semibold text-neon-violet shrink-0">{e.score}</span>
        </li>
      ))}
    </ol>
  );
}

function DifficultyPill({ d, t }: { d: GameDifficulty; t: (k: string) => string }) {
  const map: Record<GameDifficulty, string> = {
    EASY: 'text-neon-emerald bg-neon-emerald/10 border-neon-emerald/20',
    MEDIUM: 'text-neon-orange bg-neon-orange/10 border-neon-orange/20',
    HARD: 'text-neon-red bg-neon-red/10 border-neon-red/20',
  };
  return (
    <span className={['inline-flex items-center px-2 py-0.5 rounded border text-[11px] font-medium', map[d]].join(' ')}>
      {t(`games.difficulty${d}`)}
    </span>
  );
}

function ComingSoon({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-darkborder bg-darkcard/40 py-20 text-center">
      <Lock className="w-8 h-8 text-text-muted mx-auto mb-3" />
      <p className="text-sm text-text-secondary">{label}</p>
    </div>
  );
}

function MissingComponent({ componentKey }: { componentKey: string | null }) {
  return (
    <div className="rounded-2xl border border-darkborder bg-darkcard/40 py-16 text-center px-6">
      <Gamepad2 className="w-8 h-8 text-text-muted mx-auto mb-3" />
      <p className="text-sm text-text-secondary">Game này chưa sẵn sàng để chơi.</p>
      {componentKey && (
        <p className="mt-1 text-[11px] text-text-muted">
          Component <code className="px-1 rounded bg-white/5">{componentKey}</code> chưa có trong registry.
        </p>
      )}
    </div>
  );
}

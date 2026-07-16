'use client';

/**
 * Playground portal — arcade-lobby layout.
 *
 * Filtering/search/view-toggle run client-side over the server-fetched list
 * (the catalogue is small; one round trip beats a request per keystroke) and
 * are mirrored into the URL via replaceState so a filtered view is shareable
 * without pushing history entries on every keystroke.
 *
 * All chrome strings go through useTranslation(); game content itself is
 * localized from the DB's titleVi/descriptionVi columns.
 */

import { useEffect, useMemo, useState, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search, Trophy, Clock, Lock, Play, Sparkles, X, LayoutGrid, Rows3, Gamepad2, Medal,
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import GamesBackground from '@/components/games/GamesBackground';
import type { GameDto, GameCategoryDto, GameStats, GameLeaderEntry, GameDifficulty } from '@/lib/api';

interface Props {
  games: GameDto[];
  categories: GameCategoryDto[];
  stats: GameStats;
  leaders: GameLeaderEntry[];
}

const NEW_DAYS = 14;
const isNew = (g: GameDto) => Date.now() - new Date(g.createdAt).getTime() < NEW_DAYS * 86_400_000;

export default function GamesPortalClient({ games, categories, stats, leaders }: Props) {
  const { t, locale } = useTranslation();
  const params = useSearchParams();

  const [query, setQuery] = useState(params.get('q') ?? '');
  const [cat, setCat] = useState(params.get('cat') ?? '');
  const [view, setView] = useState<'grid' | 'by-category'>(
    params.get('view') === 'by-category' ? 'by-category' : 'grid',
  );

  const L = useCallback(
    (en: string | null | undefined, vi: string | null | undefined) =>
      (locale === 'vi' ? vi || en : en || vi) ?? '',
    [locale],
  );

  // Mirror filters into the URL (replace, not push — typing shouldn't spam history).
  useEffect(() => {
    const sp = new URLSearchParams();
    if (query.trim()) sp.set('q', query.trim());
    if (cat) sp.set('cat', cat);
    if (view !== 'grid') sp.set('view', view);
    const qs = sp.toString();
    window.history.replaceState(null, '', qs ? `/games?${qs}` : '/games');
  }, [query, cat, view]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return games.filter((g) => {
      if (cat && g.category?.slug !== cat) return false;
      if (!q) return true;
      return (
        g.title.toLowerCase().includes(q) ||
        (g.titleVi ?? '').toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.tags.some((x) => x.toLowerCase().includes(q))
      );
    });
  }, [games, query, cat]);

  // Spotlight: the featured game that sorts first.
  const spotlight = useMemo(
    () => games.filter((g) => g.featured && g.status === 'PUBLISHED').sort((a, b) => a.sortOrder - b.sortOrder)[0],
    [games],
  );

  const grouped = useMemo(() => {
    return categories
      .map((c) => ({ category: c, items: filtered.filter((g) => g.category?.slug === c.slug) }))
      .filter((s) => s.items.length > 0);
  }, [categories, filtered]);

  const hasFilters = !!query.trim() || !!cat;

  return (
    <div className="min-h-screen pt-20 pb-20" style={{ background: '#020110' }}>
      {/* Particle field lives behind the hero only — it's masked out below so it
          never competes with the card grid or burn CPU behind content. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[70vh] overflow-hidden [mask-image:linear-gradient(to_bottom,black_55%,transparent_100%)]">
        <GamesBackground />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Hero ────────────────────────────────────── */}
        <header className="pt-10 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-violet/10 border border-neon-violet/20 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-neon-violet" />
            <span className="text-xs text-neon-violet font-medium">{t('games.title')}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-text-primary tracking-tight leading-[1.05]">
            {t('games.title')}
          </h1>
          <p className="mt-3 text-base sm:text-lg text-text-secondary max-w-2xl leading-relaxed">
            {t('games.tagline')}
          </p>
          <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Stat n={stats.games} label={t('games.statGames')} />
            <Stat n={stats.categories} label={t('games.statCategories')} />
            <Stat n={stats.totalPlays} label={t('games.statPlays')} />
          </dl>
        </header>

        {/* ── Featured spotlight ──────────────────────── */}
        {spotlight && !hasFilters && (
          <section className="mb-10">
            <div className="group grid grid-cols-1 md:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-darkborder bg-darkcard/60 backdrop-blur-sm">
              <div className="relative aspect-video md:aspect-auto md:min-h-[280px] overflow-hidden bg-darkbg">
                {spotlight.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={spotlight.coverImage}
                    alt={L(spotlight.title, spotlight.titleVi)}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transform-none"
                  />
                ) : (
                  <CoverFallback color={spotlight.category?.color} />
                )}
                <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-neon-orange/20 text-neon-orange border border-neon-orange/30 backdrop-blur-md">
                  <Trophy className="w-3 h-3" /> {t('games.featured')}
                </span>
              </div>
              <div className="p-6 sm:p-8 flex flex-col justify-center">
                <CategoryBadge category={spotlight.category} />
                <h2 className="mt-3 text-2xl sm:text-3xl font-heading font-bold text-text-primary leading-tight">
                  {L(spotlight.title, spotlight.titleVi)}
                </h2>
                <p className="mt-2 text-sm text-text-secondary leading-relaxed line-clamp-3">
                  {L(spotlight.description, spotlight.descriptionVi)}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-text-muted">
                  <DifficultyPill d={spotlight.difficulty} t={t} />
                  {spotlight.estimatedTime && (
                    <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {spotlight.estimatedTime}</span>
                  )}
                  <span>· {spotlight.playCount} {t('games.plays')}</span>
                </div>
                <Link
                  href={`/games/${spotlight.slug}`}
                  className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-sm font-semibold shadow-neon hover:opacity-90 active:scale-95 transition-all w-fit"
                >
                  <Play className="w-4 h-4" /> {t('games.playNow')}
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── Filter bar (sticky) ─────────────────────── */}
        <div className="sticky top-16 z-30 -mx-4 px-4 py-3 mb-6 bg-[#020110]/85 backdrop-blur-md border-b border-darkborder/60">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('games.searchPlaceholder')}
                aria-label={t('games.searchPlaceholder')}
                className="w-full pl-10 pr-9 py-2.5 bg-darkcard/80 border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 focus:ring-2 focus:ring-neon-violet/20"
              />
              {query && (
                <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary" aria-label={t('games.clearFilters')}>
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="flex gap-1 rounded-xl bg-darkcard/80 border border-darkborder p-1 shrink-0">
              <ViewBtn active={view === 'grid'} onClick={() => setView('grid')} icon={<LayoutGrid className="w-3.5 h-3.5" />} label={t('games.viewGrid')} />
              <ViewBtn active={view === 'by-category'} onClick={() => setView('by-category')} icon={<Rows3 className="w-3.5 h-3.5" />} label={t('games.viewByCategory')} />
            </div>
          </div>

          {/* Category chips */}
          <div className="mt-2.5 flex gap-1.5 overflow-x-auto pb-1 -mb-1 scrollbar-none">
            <Chip active={!cat} onClick={() => setCat('')} label={t('games.all')} />
            {categories.map((c) => (
              <Chip
                key={c.slug}
                active={cat === c.slug}
                onClick={() => setCat(cat === c.slug ? '' : c.slug)}
                label={L(c.name, c.nameVi)}
                color={c.color}
                count={c.gameCount}
              />
            ))}
          </div>
        </div>

        {/* ── Grid ────────────────────────────────────── */}
        {games.length === 0 ? (
          <Empty text={t('games.empty')} />
        ) : filtered.length === 0 ? (
          <Empty text={t('games.noResults')} action={{ label: t('games.clearFilters'), onClick: () => { setQuery(''); setCat(''); } }} />
        ) : view === 'grid' ? (
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((g) => <GameCard key={g.id} game={g} t={t} L={L} />)}
          </ul>
        ) : (
          <div className="space-y-10">
            {grouped.map(({ category, items }) => (
              <section key={category.slug}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: category.color ?? '#A78BFA' }} />
                  <h2 className="text-lg font-heading font-semibold text-text-primary">{L(category.name, category.nameVi)}</h2>
                  <span className="text-xs text-text-muted">({items.length})</span>
                </div>
                {/* Horizontal scroll on mobile, grid from md up. */}
                <ul className="flex md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-none">
                  {items.map((g) => (
                    <li key={g.id} className="w-[70vw] sm:w-[45vw] md:w-auto shrink-0 md:shrink list-none">
                      <GameCard game={g} t={t} L={L} bare />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}

        {/* ── Leaderboard teaser ──────────────────────── */}
        {leaders.length > 0 && (
          <section className="mt-14 rounded-2xl border border-darkborder bg-darkcard/60 backdrop-blur-sm p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-heading font-semibold text-text-primary flex items-center gap-2">
                <Trophy className="w-4 h-4 text-neon-orange" /> {t('games.topScores')}
              </h2>
              <Link href="/games/leaderboard" className="text-xs text-neon-violet hover:underline">
                {t('games.viewLeaderboard')} →
              </Link>
            </div>
            <ol className="space-y-2">
              {leaders.map((e) => (
                <li key={e.id} className="flex items-center gap-3 text-sm">
                  <span className={[
                    'w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0',
                    e.rank === 1 ? 'bg-neon-orange/20 text-neon-orange'
                      : e.rank === 2 ? 'bg-white/10 text-text-secondary'
                      : e.rank === 3 ? 'bg-amber-700/20 text-amber-500'
                      : 'text-text-muted',
                  ].join(' ')}>
                    {e.rank <= 3 ? <Medal className="w-3 h-3" /> : e.rank}
                  </span>
                  <span className="text-text-primary font-medium truncate">{e.player?.name ?? t('games.anonymous')}</span>
                  {e.game && (
                    <Link href={`/games/${e.game.slug}`} className="text-xs text-text-muted hover:text-neon-violet truncate">
                      {L(e.game.title, e.game.titleVi)}
                    </Link>
                  )}
                  <span className="ml-auto tabular-nums font-semibold text-neon-violet shrink-0">{e.score}</span>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </div>
  );
}

// ─── Card ──────────────────────────────────────────────────────────

type TFn = (k: string) => string;
type LFn = (en: string | null | undefined, vi: string | null | undefined) => string;

function GameCard({ game, t, L, bare }: { game: GameDto; t: TFn; L: LFn; bare?: boolean }) {
  const soon = game.status === 'COMING_SOON';
  const color = game.category?.color ?? '#A78BFA';
  const inner = (
    <div
      className={[
        'group relative h-full rounded-2xl overflow-hidden border border-darkborder bg-darkcard/60 backdrop-blur-sm',
        // Hover lift + category-coloured glow. transform/box-shadow only → no
        // layout shift; disabled under prefers-reduced-motion.
        'transition-[transform,box-shadow,border-color] duration-300 motion-reduce:transition-none',
        soon ? 'opacity-60' : 'hover:-translate-y-1 motion-reduce:hover:translate-y-0',
      ].join(' ')}
      style={soon ? undefined : ({ '--glow': color } as React.CSSProperties)}
    >
      {/* Cover */}
      <div className="relative aspect-video overflow-hidden bg-darkbg">
        {game.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={game.coverImage}
            alt={L(game.title, game.titleVi)}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none"
          />
        ) : (
          <CoverFallback color={color} />
        )}
        <div className="absolute top-2 left-2"><CategoryBadge category={game.category} compact /></div>
        {soon ? (
          <span className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/60 text-text-secondary border border-white/10 backdrop-blur-md">
            <Lock className="w-2.5 h-2.5" /> {t('games.comingSoon')}
          </span>
        ) : isNew(game) ? (
          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-neon-emerald/20 text-neon-emerald border border-neon-emerald/30 backdrop-blur-md">
            {t('games.isNew')}
          </span>
        ) : null}
      </div>

      {/* Body */}
      <div className="p-3.5 space-y-2">
        <h3 className="font-heading font-semibold text-text-primary text-sm leading-snug line-clamp-1">
          {L(game.title, game.titleVi)}
        </h3>
        <p className="text-[11px] text-text-muted leading-relaxed line-clamp-2 min-h-[2.4em]">
          {L(game.description, game.descriptionVi)}
        </p>
        <div className="flex items-center gap-2 text-[10px] text-text-muted">
          <DifficultyPill d={game.difficulty} t={t} tiny />
          {game.estimatedTime && <span className="inline-flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{game.estimatedTime}</span>}
        </div>
        <span
          className={[
            'mt-1 flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-lg text-xs font-semibold transition-colors',
            soon
              ? 'bg-white/[0.03] text-text-muted cursor-not-allowed'
              : 'bg-neon-violet/15 text-neon-violet group-hover:bg-neon-violet group-hover:text-white',
          ].join(' ')}
        >
          {soon ? <><Lock className="w-3 h-3" /> {t('games.comingSoon')}</> : <><Play className="w-3 h-3" /> {t('games.play')}</>}
        </span>
      </div>

      {/* Category-coloured border glow on hover (no layout impact). */}
      {!soon && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ boxShadow: `inset 0 0 0 1px ${color}66, 0 10px 30px -12px ${color}80` }}
        />
      )}
    </div>
  );

  if (soon) {
    return bare ? <div aria-disabled className="h-full">{inner}</div> : <li className="list-none"><div aria-disabled className="h-full">{inner}</div></li>;
  }
  const link = <Link href={`/games/${game.slug}`} className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-violet rounded-2xl">{inner}</Link>;
  return bare ? link : <li className="list-none">{link}</li>;
}

// ─── Bits ──────────────────────────────────────────────────────────

function CoverFallback({ color }: { color?: string | null }) {
  const c = color ?? '#A78BFA';
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ background: `radial-gradient(circle at 30% 25%, ${c}33, transparent 60%), linear-gradient(135deg, #12101f, #0a0a14)` }}>
      <Gamepad2 className="w-8 h-8" style={{ color: `${c}99` }} />
    </div>
  );
}

function CategoryBadge({ category, compact }: { category?: GameCategoryDto; compact?: boolean }) {
  if (!category) return null;
  const c = category.color ?? '#A78BFA';
  return (
    <span
      className={['inline-flex items-center rounded-full font-medium border backdrop-blur-md', compact ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px] w-fit'].join(' ')}
      style={{ color: c, borderColor: `${c}40`, background: `${c}1f` }}
    >
      {category.name}
    </span>
  );
}

function DifficultyPill({ d, t, tiny }: { d: GameDifficulty; t: TFn; tiny?: boolean }) {
  const map: Record<GameDifficulty, string> = {
    EASY: 'text-neon-emerald bg-neon-emerald/10 border-neon-emerald/20',
    MEDIUM: 'text-neon-orange bg-neon-orange/10 border-neon-orange/20',
    HARD: 'text-neon-red bg-neon-red/10 border-neon-red/20',
  };
  return (
    <span className={['inline-flex items-center rounded border font-medium', tiny ? 'px-1.5 py-0.5 text-[9px]' : 'px-2 py-0.5 text-[11px]', map[d]].join(' ')}>
      {t(`games.difficulty${d}`)}
    </span>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <dt className="sr-only">{label}</dt>
      <dd className="text-xl font-heading font-bold text-text-primary tabular-nums">{n.toLocaleString()}</dd>
      <span className="text-text-muted text-xs">{label}</span>
    </div>
  );
}

function Chip({ active, onClick, label, color, count }: {
  active: boolean; onClick: () => void; label: string; color?: string | null; count?: number;
}) {
  const c = color ?? '#A78BFA';
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={[
        'shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap',
        active ? 'text-white' : 'text-text-secondary border-darkborder hover:text-text-primary',
      ].join(' ')}
      style={active ? { background: c, borderColor: c } : { background: 'rgba(255,255,255,0.03)' }}
    >
      {label}
      {count != null && <span className={active ? 'opacity-80' : 'text-text-muted'}>{count}</span>}
    </button>
  );
}

function ViewBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      title={label}
      className={[
        'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap',
        active ? 'bg-neon-violet/20 text-neon-violet' : 'text-text-secondary hover:text-text-primary',
      ].join(' ')}
    >
      {icon}<span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function Empty({ text, action }: { text: string; action?: { label: string; onClick: () => void } }) {
  return (
    <div className="rounded-2xl border border-darkborder bg-darkcard/60 p-12 text-center">
      <Gamepad2 className="w-8 h-8 text-text-muted mx-auto mb-3" />
      <p className="text-sm text-text-secondary">{text}</p>
      {action && (
        <button onClick={action.onClick} className="mt-4 px-4 py-2 rounded-xl bg-white/[0.04] border border-darkborder text-sm text-text-secondary hover:text-text-primary hover:border-neon-violet/30 transition-all">
          {action.label}
        </button>
      )}
    </div>
  );
}
